from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import urllib.request
import urllib.parse
from train_model import ResumeAnalyzer
import traceback

app = Flask(__name__)
CORS(app)

analyzer = None


ROLE_KNOWLEDGE_BASE = {
    'frontend': {
        'title': 'Frontend Developer',
        'requiredSkills': ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Next.js', 'TailwindCSS', 'Git', 'REST APIs', 'Jest', 'Redux'],
        'salary': {'junior': {'inr': '4-8 LPA', 'usd': '$55k-$80k'}, 'mid': {'inr': '8-18 LPA', 'usd': '$80k-$120k'}, 'senior': {'inr': '18-40 LPA', 'usd': '$120k-$180k'}},
        'marketDemand': 'Very High', 'demandTrend': '+32% YoY',
        'topCompanies': ['Google', 'Meta', 'Airbnb', 'Shopify', 'Vercel', 'Netflix'],
        'jobOpenings': '142,000+', 'avgTimeToHire': '3-5 months'
    },
    'backend': {
        'title': 'Backend Developer',
        'requiredSkills': ['Node.js', 'Python', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'REST APIs', 'GraphQL', 'SQL', 'AWS'],
        'salary': {'junior': {'inr': '5-10 LPA', 'usd': '$60k-$90k'}, 'mid': {'inr': '10-22 LPA', 'usd': '$90k-$130k'}, 'senior': {'inr': '22-50 LPA', 'usd': '$130k-$200k'}},
        'marketDemand': 'High', 'demandTrend': '+28% YoY',
        'topCompanies': ['Amazon', 'Microsoft', 'Stripe', 'Uber', 'Twitter'],
        'jobOpenings': '118,000+', 'avgTimeToHire': '4-6 months'
    },
    'datascience': {
        'title': 'Data Scientist',
        'requiredSkills': ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Machine Learning', 'SQL', 'TensorFlow', 'PyTorch', 'Tableau', 'R', 'Deep Learning'],
        'salary': {'junior': {'inr': '6-12 LPA', 'usd': '$70k-$100k'}, 'mid': {'inr': '12-28 LPA', 'usd': '$100k-$150k'}, 'senior': {'inr': '28-60 LPA', 'usd': '$150k-$220k'}},
        'marketDemand': 'Extremely High', 'demandTrend': '+45% YoY',
        'topCompanies': ['Google DeepMind', 'OpenAI', 'Netflix', 'Databricks'],
        'jobOpenings': '87,000+', 'avgTimeToHire': '5-7 months'
    },
    'mleng': {
        'title': 'ML Engineer',
        'requiredSkills': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Deep Learning', 'MLOps', 'Docker', 'Kubernetes', 'AWS SageMaker', 'Spark'],
        'salary': {'junior': {'inr': '8-15 LPA', 'usd': '$85k-$120k'}, 'mid': {'inr': '15-35 LPA', 'usd': '$120k-$180k'}, 'senior': {'inr': '35-80 LPA', 'usd': '$180k-$280k'}},
        'marketDemand': 'Explosive', 'demandTrend': '+62% YoY',
        'topCompanies': ['OpenAI', 'Anthropic', 'Google', 'Meta AI', 'Hugging Face'],
        'jobOpenings': '54,000+', 'avgTimeToHire': '6-8 months'
    },
    'devops': {
        'title': 'DevOps Engineer',
        'requiredSkills': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Jenkins', 'Ansible', 'Git', 'Bash'],
        'salary': {'junior': {'inr': '5-10 LPA', 'usd': '$65k-$95k'}, 'mid': {'inr': '10-24 LPA', 'usd': '$95k-$140k'}, 'senior': {'inr': '24-55 LPA', 'usd': '$140k-$200k'}},
        'marketDemand': 'High', 'demandTrend': '+25% YoY',
        'topCompanies': ['HashiCorp', 'GitLab', 'RedHat', 'AWS', 'Google Cloud'],
        'jobOpenings': '73,000+', 'avgTimeToHire': '4-6 months'
    },
    'mobile': {
        'title': 'Mobile Developer',
        'requiredSkills': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'TypeScript', 'iOS', 'Android', 'Firebase', 'REST APIs', 'Git'],
        'salary': {'junior': {'inr': '4-9 LPA', 'usd': '$60k-$90k'}, 'mid': {'inr': '9-20 LPA', 'usd': '$90k-$130k'}, 'senior': {'inr': '20-45 LPA', 'usd': '$130k-$190k'}},
        'marketDemand': 'High', 'demandTrend': '+22% YoY',
        'topCompanies': ['Apple', 'Google', 'Snap', 'TikTok', 'Spotify'],
        'jobOpenings': '68,000+', 'avgTimeToHire': '3-5 months'
    }
}

SKILL_LEARNING_WEEKS = {
    'React': 6, 'JavaScript': 10, 'TypeScript': 4, 'HTML': 3, 'CSS': 3,
    'Next.js': 3, 'TailwindCSS': 2, 'Redux': 3, 'Jest': 3,
    'Node.js': 5, 'Python': 8, 'Express': 3, 'PostgreSQL': 4, 'MongoDB': 3,
    'Redis': 2, 'Docker': 3, 'Kubernetes': 5, 'AWS': 8, 'GraphQL': 3,
    'SQL': 5, 'Git': 2, 'Machine Learning': 12, 'Deep Learning': 10,
    'TensorFlow': 6, 'PyTorch': 6, 'Pandas': 4, 'NumPy': 3,
    'Scikit-Learn': 5, 'CI/CD': 3, 'Terraform': 4, 'Linux': 4,
    'Flutter': 6, 'Swift': 8, 'Kotlin': 6, 'React Native': 5,
}


SKILL_RESOURCES = {
    'react': [{'title': 'React JS Crash Course 2024', 'videoId': 'w7ejDZ8SWv8', 'platform': 'YouTube', 'url': 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', 'instructor': 'Traversy Media', 'duration': '1.5h', 'rating': 4.9}],
    'javascript': [{'title': 'JavaScript Tutorial Full Course - Beginner to Pro', 'videoId': 'EerdGm-ehJQ', 'platform': 'YouTube', 'url': 'https://www.youtube.com/watch?v=EerdGm-ehJQ', 'instructor': 'SuperSimpleDev', 'duration': '8h', 'rating': 4.9}],
    'typescript': [{'title': 'TypeScript Full Course for Beginners', 'videoId': 'gp5HZO7BMz0', 'platform': 'YouTube', 'url': 'https://www.youtube.com/watch?v=gp5HZO7BMz0', 'instructor': 'Dave Gray', 'duration': '3h', 'rating': 4.8}],
    'python': [{'title': 'Learn Python - Full Course for Beginners', 'videoId': 'rfscVSVCvtQ', 'platform': 'YouTube', 'url': 'https://www.youtube.com/watch?v=rfscVSVCvtQ', 'instructor': 'freeCodeCamp', 'duration': '4.5h', 'rating': 4.9},
               {'title': '100 Days of Code: Python Bootcamp', 'platform': 'Udemy', 'url': 'https://www.udemy.com/course/100-days-of-code/', 'instructor': 'Dr. Angela Yu', 'duration': '58h', 'rating': 4.8}],
    'docker': [{'title': 'Docker Tutorial for Beginners - Full Course', 'videoId': '99LowisZMu8', 'platform': 'YouTube', 'url': 'https://www.youtube.com/watch?v=99LowisZMu8', 'instructor': 'TechWorld with Nana', 'duration': '4h', 'rating': 4.9}],
    'kubernetes': [{'title': 'Kubernetes Tutorial for Beginners', 'videoId': 'X48VuDVv0do', 'platform': 'YouTube', 'url': 'https://www.youtube.com/watch?v=X48VuDVv0do', 'instructor': 'TechWorld with Nana', 'duration': '4h', 'rating': 4.9}],
    'aws': [{'title': 'AWS Cloud Practitioner Essentials', 'platform': 'Coursera', 'url': 'https://www.coursera.org/learn/aws-cloud-practitioner-essentials', 'instructor': 'AWS', 'duration': '15h', 'rating': 4.6}],
    'machine learning': [{'title': 'Machine Learning Specialization', 'platform': 'Coursera', 'url': 'https://www.coursera.org/specializations/machine-learning-introduction', 'instructor': 'Andrew Ng (Stanford)', 'duration': '3 months', 'rating': 4.9}],
    'sql': [{'title': 'SQL Tutorial - Full Database Course for Beginners', 'videoId': 'HXV3zeQKqGY', 'platform': 'YouTube', 'url': 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 'instructor': 'freeCodeCamp', 'duration': '4h', 'rating': 4.9}],
    'node': [{'title': 'Node.js Crash Course', 'videoId': 'fBNz5xF-Kx4', 'platform': 'YouTube', 'url': 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', 'instructor': 'Traversy Media', 'duration': '1.5h', 'rating': 4.8}],
}


def resolve_role(target_role):
    r = (target_role or '').lower()
    if 'front' in r or 'react' in r or 'ui' in r or 'vue' in r:
        return 'frontend'
    if 'back' in r or 'node' in r or 'server' in r or 'api' in r or 'django' in r:
        return 'backend'
    if 'ml' in r or 'machine' in r or 'mle' in r:
        return 'mleng'
    if 'data' in r or 'science' in r:
        return 'datascience'
    if 'devops' in r or 'cloud' in r or 'infra' in r:
        return 'devops'
    if 'mobil' in r or 'ios' in r or 'android' in r or 'flutter' in r:
        return 'mobile'
    return 'backend'


def load_model():
    global analyzer
    try:
        model_path = 'models/resume_model.pkl'
        if os.path.exists(model_path):
            analyzer = ResumeAnalyzer.load(model_path)
            print("Model loaded successfully")
        else:
            print("Model file not found. Using rule-based analysis.")
            analyzer = None
    except Exception as e:
        print(f"Error loading model: {e}")
        analyzer = None


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': analyzer is not None})


@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    """Analyze a resume and return rich predictions"""
    try:
        data = request.json
        resume_text = data.get('text', '')
        target_role = data.get('target_role', 'Software Engineer')

        if not resume_text:
            return jsonify({'error': 'Resume text is required'}), 400

        role_key = resolve_role(target_role)
        role_data = ROLE_KNOWLEDGE_BASE.get(role_key, ROLE_KNOWLEDGE_BASE['backend'])
        required_skills = role_data['requiredSkills']

        
        text_lower = resume_text.lower()
        user_skills = [s for s in required_skills if s.lower() in text_lower]
        missing_skills = [s for s in required_skills if s.lower() not in text_lower]

        
        match_count = len(user_skills)
        total_count = len(required_skills)
        has_all = len(missing_skills) == 0 and total_count > 2

        if analyzer is not None:
            try:
                ml_result = analyzer.predict(resume_text, target_role)
                score = ml_result.get('score', 70)
            except Exception:
                score = round((match_count / max(total_count, 1)) * 100)
        else:
            score = round((match_count / max(total_count, 1)) * 100)

        if has_all:
            score = max(score, 85)
        score = max(42, min(98, score))

        level = 'Senior' if score >= 80 else 'Mid-level' if score >= 60 else 'Junior'
        salary_key = 'senior' if score >= 80 else 'mid' if score >= 60 else 'junior'
        salary = role_data['salary'][salary_key]

        
        missing_with_time = [{'skill': s, 'weeks': SKILL_LEARNING_WEEKS.get(s, 4)} for s in missing_skills]
        total_weeks = sum(m['weeks'] for m in missing_with_time)

        
        if score < 58:
            roadmap = [
                f"🌱 Start with fundamentals: Master {', '.join(missing_skills[:2]) if missing_skills else 'core concepts'} first",
                f"Week 1-4: Daily hands-on coding in {role_data['title']} tech stack",
                f"Week 5-8: Build 2-3 portfolio projects to show employers",
                f"Week 9-12: Learn {', '.join(missing_skills[2:4]) if len(missing_skills) > 2 else 'advanced patterns'}",
                f"Month 4-6: Apply to Junior {role_data['title']} roles",
                f"🎯 Target: First job in 4-6 months | Salary: {salary['inr']}"
            ]
        elif score < 78:
            roadmap = [
                f"🚀 Bridge {len(missing_skills)} key skill gaps to reach senior level",
                f"Priority 1: {missing_skills[0] if missing_skills else 'Advanced patterns'} ({SKILL_LEARNING_WEEKS.get(missing_skills[0], 4) if missing_skills else 4} weeks)",
                f"Priority 2: Build production-ready project with {', '.join((user_skills or required_skills)[:3])}",
                f"Priority 3: System design basics for senior interviews",
                f"Priority 4: Study LeetCode 75 problems (2-3 months parallel)",
                f"🎯 Target: Mid→Senior at {', '.join(role_data['topCompanies'][:3])}"
            ]
        else:
            roadmap = [
                f"⚡ Senior track: Architecture & leadership mastery",
                f"Phase 1: System design for distributed systems at scale",
                f"Phase 2: {missing_skills[0] if missing_skills else 'Cutting-edge tooling'} mastery",
                f"Phase 3: Mentoring, code reviews, open source contributions",
                f"Phase 4: Tech blog, conference talks for community presence",
                f"🎯 Target: Senior {role_data['title']} at {role_data['topCompanies'][0]}"
            ]

        
        courses_data = []
        for skill in missing_skills[:4]:
            skill_lower = skill.lower()
            resources = None
            for key, val in SKILL_RESOURCES.items():
                if key in skill_lower or skill_lower in key:
                    resources = val
                    break
            if resources:
                for r in resources[:2]:
                    courses_data.append({**r, 'forSkill': skill})
            else:
                courses_data.append({
                    'title': f'{skill} Full Course - Beginner to Advanced',
                    'platform': 'YouTube',
                    'url': f'https://www.youtube.com/results?search_query={urllib.parse.quote(skill + " full course")}',
                    'instructor': 'freeCodeCamp',
                    'duration': '3-8h',
                    'rating': 4.6,
                    'forSkill': skill
                })

        return jsonify({
            'score': score,
            'level': level,
            'salary': salary,
            'skills': user_skills,
            'missingSkills': missing_skills,
            'missingWithTime': missing_with_time,
            'roadmap': roadmap,
            'coursesData': courses_data,
            'recommendedCourses': [f"{c['platform']}: {c['title']} | {c['url']}" for c in courses_data],
            'insights': {
                'marketDemand': role_data['marketDemand'],
                'demandTrend': role_data['demandTrend'],
                'jobOpenings': role_data['jobOpenings'],
                'avgTimeToHire': role_data['avgTimeToHire'],
                'topCompanies': role_data['topCompanies'],
                'totalLearningWeeks': total_weeks
            },
            'roleData': {
                'title': role_data['title'],
                'topCompanies': role_data['topCompanies']
            }
        }), 200

    except Exception as e:
        print(f"Error in analyze endpoint: {e}")
        print(traceback.format_exc())
        return jsonify({'error': 'Analysis failed', 'details': str(e)}), 500


@app.route('/api/role-insights', methods=['GET'])
def role_insights():
    """Get salary, demand, companies for a role"""
    role = request.args.get('role', 'backend')
    role_key = resolve_role(role)
    data = ROLE_KNOWLEDGE_BASE.get(role_key, ROLE_KNOWLEDGE_BASE['backend'])
    return jsonify(data), 200


@app.route('/api/train', methods=['POST'])
def train_model():
    """Train the model from real user analyses and fallback to synthetic"""
    try:
        from train_model import ResumeAnalyzer

        storage_path = os.path.join('storage', 'analyses.json')
        dataset = []

        if os.path.exists(storage_path):
            with open(storage_path, 'r', encoding='utf-8') as f:
                analyses = json.load(f)

            def derive_quality_level(score):
                try:
                    s = float(score)
                except Exception:
                    s = 60
                if s >= 80: return 'senior'
                if s >= 60: return 'mid'
                return 'junior'

            def safe_json_array(val):
                if isinstance(val, list): return val
                if not val: return []
                if isinstance(val, str):
                    try:
                        parsed = json.loads(val)
                        return parsed if isinstance(parsed, list) else []
                    except Exception:
                        return [x.strip() for x in val.split(',') if x.strip()]
                return []

            for a in analyses or []:
                score = a.get('score', None)
                expected_score = score if score is not None else 75
                missing_skills = safe_json_array(a.get('missing_skills'))
                dataset.append({
                    'technical_skills': [],
                    'soft_skills': [],
                    'missing_skills': missing_skills,
                    'experience': [],
                    'projects': [],
                    'certifications': [],
                    'education': {'gpa': 3.0},
                    'quality_level': derive_quality_level(expected_score),
                    'expected_score': expected_score
                })

        if len(dataset) < 20:
            import generate_synthetic_data
            print(f"Real dataset too small ({len(dataset)}). Using synthetic...")
            dataset = generate_synthetic_data.generate_dataset(num_resumes=200)

        print(f"Training model on {len(dataset)} samples...")
        analyzer_instance = ResumeAnalyzer()
        analyzer_instance.train(dataset)
        analyzer_instance.save('models/resume_model.pkl')

        global analyzer
        analyzer = analyzer_instance

        return jsonify({'status': 'success', 'message': f'Model trained on {len(dataset)} samples'}), 200

    except Exception as e:
        print(f"Error in train endpoint: {e}")
        print(traceback.format_exc())
        return jsonify({'error': 'Training failed', 'details': str(e)}), 500


@app.route('/api/analyses', methods=['POST'])
def insert_analysis():
    try:
        os.makedirs('storage', exist_ok=True)
        payload = request.json or {}
        storage_path = os.path.join('storage', 'analyses.json')

        if os.path.exists(storage_path):
            with open(storage_path, 'r', encoding='utf-8') as f:
                analyses = json.load(f)
        else:
            analyses = []

        analysis = {
            'id': payload.get('id'),
            'user_id': payload.get('user_id', 'guest-user-id'),
            'role_transition': payload.get('role_transition', 'Unknown Role'),
            'score': payload.get('score'),
            'missing_skills': payload.get('missing_skills', '[]'),
            'roadmap': payload.get('roadmap', '[]'),
            'courses': payload.get('courses', '[]'),
            'raw_resume': payload.get('raw_resume', ''),
            'created_at': payload.get('created_at') or __import__('datetime').datetime.utcnow().isoformat() + 'Z'
        }

        analyses.insert(0, analysis)
        with open(storage_path, 'w', encoding='utf-8') as f:
            json.dump(analyses, f, ensure_ascii=False, indent=2)

        return jsonify(analysis), 200
    except Exception as e:
        print(f"Error inserting analysis: {e}")
        return jsonify({'error': 'Insert failed', 'details': str(e)}), 500


@app.route('/api/analyses', methods=['GET'])
def list_analyses():
    try:
        user_id = request.args.get('user_id', 'guest-user-id')
        storage_path = os.path.join('storage', 'analyses.json')
        if not os.path.exists(storage_path):
            return jsonify([]), 200

        with open(storage_path, 'r', encoding='utf-8') as f:
            analyses = json.load(f)

        filtered = [a for a in analyses if (a.get('user_id') or 'guest-user-id') == user_id]
        filtered.sort(key=lambda a: a.get('created_at') or '', reverse=True)
        return jsonify(filtered), 200
    except Exception as e:
        print(f"Error listing analyses: {e}")
        return jsonify({'error': 'Fetch failed', 'details': str(e)}), 500


@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'name': 'CareerGenie Resume Analyzer API',
        'version': '2.0.0',
        'endpoints': {
            'GET  /api/health': 'Health check',
            'POST /api/analyze': 'Analyze resume — returns rich insights, salary, courses, roadmap',
            'GET  /api/role-insights': 'Get salary/demand/companies for a role',
            'POST /api/train': 'Train/retrain the ML model',
            'POST /api/analyses': 'Save an analysis',
            'GET  /api/analyses': 'List user analyses',
        }
    })


if __name__ == '__main__':
    load_model()
    print("Starting CareerGenie Resume Analyzer API v2.0...")
    print("Endpoints:")
    print("  GET  /api/health")
    print("  POST /api/analyze  (rich insights + real courses)")
    print("  GET  /api/role-insights")
    print("  POST /api/train")
    print("\nRunning on http://localhost:5000")
    app.run(debug=True, port=5000, host='0.0.0.0')
