from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import traceback
import urllib.request
import urllib.parse


from .train_model import ResumeAnalyzer

app = FastAPI(title="Resume Analyzer ML API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = None


def load_model():
    global analyzer
    try:
        model_path = "models/resume_model.pkl"
        if os.path.exists(model_path):
            analyzer = ResumeAnalyzer.load(model_path)
            print("Model loaded successfully")
        else:
            print("Model file not found. Train the model first using: python train_model.py")
            analyzer = None
    except Exception as e:
        print(f"Error loading model: {e}")
        analyzer = None


class AnalyzePayload(BaseModel):
    text: str
    target_role: str = "Software Engineer"


@app.on_event("startup")
def startup_event():
    load_model()


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": analyzer is not None,
    }


@app.post("/api/analyze")
def analyze_resume(payload: AnalyzePayload):
    try:
        if analyzer is None:
            raise HTTPException(status_code=500, detail="Model not loaded. Please train the model first.")

        resume_text = payload.text or ""
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Resume text is required")

        result = analyzer.predict(resume_text, payload.target_role)
        return result

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in analyze endpoint: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail={"error": "Analysis failed", "details": str(e)})


@app.post("/api/train")
def train_model():
    """Train from real analyses in storage/analyses.json (first) and fallback to synthetic."""
    try:
        from .train_model import ResumeAnalyzer


        storage_path = os.path.join("storage", "analyses.json")
        dataset = []

        if os.path.exists(storage_path):
            with open(storage_path, "r", encoding="utf-8") as f:
                analyses = json.load(f)

            def derive_quality_level(score):
                try:
                    s = float(score)
                except Exception:
                    s = 60
                if s >= 80:
                    return "senior"
                if s >= 60:
                    return "mid"
                return "junior"

            def safe_json_array(val):
                if isinstance(val, list):
                    return val
                if not val:
                    return []
                if isinstance(val, str):
                    try:
                        parsed = json.loads(val)
                        return parsed if isinstance(parsed, list) else []
                    except Exception:
                        return [x.strip() for x in val.split(",") if x.strip()]
                return []

            for a in analyses or []:
                score = a.get("score", None)
                expected_score = score if score is not None else 75

                missing_skills = safe_json_array(a.get("missing_skills"))

                resume_data = {
                    "technical_skills": [],
                    "soft_skills": [],
                    "missing_skills": missing_skills,
                    "experience": [],
                    "projects": [],
                    "certifications": [],
                    "education": {"gpa": 3.0},
                    "quality_level": derive_quality_level(expected_score),
                    "expected_score": expected_score,
                }
                dataset.append(resume_data)

        if len(dataset) < 20:
            from . import generate_synthetic_data


            print(f"Real dataset too small ({len(dataset)}). Falling back to synthetic...")
            dataset = generate_synthetic_data.generate_dataset(num_resumes=200)

        print(f"Training model on {len(dataset)} samples...")
        analyzer_instance = ResumeAnalyzer()
        analyzer_instance.train(dataset)
        analyzer_instance.save("models/resume_model.pkl")

        global analyzer
        analyzer = analyzer_instance

        return {"status": "success", "message": f"Model trained on {len(dataset)} samples"}

    except Exception as e:
        print(f"Error in train endpoint: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail={"error": "Training failed", "details": str(e)})


@app.get("/api/youtube/search")
def youtube_search(skill: str = "", limit: int = 5):
    try:
        if not skill:
            raise HTTPException(status_code=400, detail="Skill parameter is required")

        videos = []
        invidious_instances = [
            "https://yewtu.be",
            "https://invidious.snopyta.org",
            "https://inv.nadeko.net",
        ]

        for instance in invidious_instances:
            try:
                search_query = urllib.parse.quote(f"{skill} tutorial")
                api_url = f"{instance}/api/v1/search?q={search_query}&type=video&limit={limit}"
                req = urllib.request.Request(
                    api_url,
                    headers={"User-Agent": "Mozilla/5.0 (compatible; CareerGenie/1.0)"},
                )
                with urllib.request.urlopen(req, timeout=8) as response:
                    data = json.loads(response.read().decode("utf-8"))

                if isinstance(data, list) and len(data) > 0:
                    for video in data[:limit]:
                        video_id = video.get("videoId", "")
                        if video_id:
                            videos.append(
                                {
                                    "title": video.get("title", "Unknown"),
                                    "videoId": video_id,
                                    "url": f"https://www.youtube.com/watch?v={video_id}",
                                    "embedUrl": f"https://www.youtube.com/embed/{video_id}",
                                    "published": video.get("published", None),
                                }
                            )
                    if videos:
                        break
            except Exception as e:
                print(f"Invidious instance {instance} failed: {e}")
                continue

        return {"skill": skill, "videos": videos, "total": len(videos)}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error searching YouTube: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail={"error": "YouTube search failed", "details": str(e)})


@app.get("/api/youtube/courses")
def youtube_courses_for_skill(skill: str = "", limit: int = 4):
    try:
        if not skill:
            raise HTTPException(status_code=400, detail="Skill parameter is required")

        courses = []
        invidious_instances = [
            "https://yewtu.be",
            "https://invidious.snopyta.org",
            "https://inv.nadeko.net",
        ]

        for instance in invidious_instances:
            try:
                search_query = urllib.parse.quote(f"{skill} tutorial")
                api_url = f"{instance}/api/v1/search?q={search_query}&type=video&limit={limit}"
                req = urllib.request.Request(
                    api_url,
                    headers={"User-Agent": "Mozilla/5.0 (compatible; CareerGenie/1.0)"},
                )
                with urllib.request.urlopen(req, timeout=8) as response:
                    data = json.loads(response.read().decode("utf-8"))

                if isinstance(data, list) and len(data) > 0:
                    for video in data[:limit]:
                        video_id = video.get("videoId", "")
                        if video_id:
                            courses.append(
                                {
                                    "title": video.get("title", f"{skill} Tutorial"),
                                    "videoId": video_id,
                                    "url": f"https://www.youtube.com/watch?v={video_id}",
                                }
                            )
                    if courses:
                        break
            except Exception as e:
                print(f"Invidious instance {instance} failed: {e}")
                continue

        if not courses:
            
            for _ in range(min(limit, 3)):
                courses.append(
                    {
                        "title": f"{skill} Tutorial by FreeCodeCamp",
                        "videoId": "",
                        "url": f"https://www.youtube.com/results?search_query={urllib.parse.quote(skill + ' tutorial freecodecamp')}",
                    }
                )

        return {"skill": skill, "recommendedCourses": courses}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting YouTube courses: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail={"error": "Failed to fetch courses", "details": str(e)})


@app.post("/api/analyses")
def insert_analysis(req: Request):
    try:
        os.makedirs("storage", exist_ok=True)
        payload = req.json()
        
    except Exception:
        pass
    return {"error": "Not implemented"}

