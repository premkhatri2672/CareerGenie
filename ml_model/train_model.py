import json
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, accuracy_score
import os


ALL_SKILLS = [
    "Python", "JavaScript", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift",
    "Kotlin", "TypeScript", "React", "Vue.js", "Angular", "Node.js", "Express",
    "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", "SQL", "MongoDB",
    "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "AWS", "Azure",
    "GCP", "Git", "Linux", "Windows", "Mac", "REST API", "GraphQL", "Microservices",
    "Agile", "DevOps", "CI/CD", "Jenkins", "GitHub Actions", "TensorFlow",
    "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Machine Learning",
    "Deep Learning", "NLP", "Computer Vision", "Data Science", "Big Data", "Spark",
    "Hadoop", "HTML", "CSS", "SCSS", "Bootstrap", "Tailwind CSS", "WebSocket",
    "JWT", "OAuth", "Firebase", "Supabase", "Elasticsearch", "Kafka", "RabbitMQ"
]

SOFT_SKILLS = [
    "Leadership", "Communication", "Problem Solving", "Team Work", "Time Management",
    "Critical Thinking", "Creativity", "Adaptability", "Project Management",
    "Negotiation", "Presentation Skills", "Analytical Skills", "Decision Making"
]

class ResumeAnalyzer:
    """ML Model for resume analysis"""

    def __init__(self):
        self.score_model = None
        self.level_model = None
        self.vectorizer = TfidfVectorizer(max_features=100)
        self.scaler = StandardScaler()
        self.skill_mappings = {}

    def extract_features(self, resume_data):
        """Extract features from resume data"""
        features = {}

        
        technical_skills = resume_data.get('technical_skills', []) or []
        missing_skills = resume_data.get('missing_skills', []) or []
        soft_skills = resume_data.get('soft_skills', []) or []


        
        features['num_technical_skills'] = len(technical_skills)
        features['num_soft_skills'] = len(soft_skills)
        features['num_missing_skills'] = len(missing_skills)

        
        experience = resume_data.get('experience', [])
        features['num_jobs'] = len(experience)
        total_months = sum(exp.get('duration_months', 0) for exp in experience)
        features['total_experience_months'] = total_months
        features['avg_job_duration'] = total_months / max(len(experience), 1)

        
        education = resume_data.get('education', {})
        features['gpa'] = education.get('gpa', 3.0)
        features['has_degree'] = 1 if education.get('degree') else 0

        
        projects = resume_data.get('projects', [])
        features['num_projects'] = len(projects)

        
        certifications = resume_data.get('certifications', [])
        features['num_certifications'] = len(certifications)

        
        total_skills = len(technical_skills) + len(soft_skills)
        features['skill_diversity'] = len(set(technical_skills)) / max(total_skills, 1)

        
        high_demand = {"Python", "JavaScript", "React", "AWS", "Docker", "Kubernetes", "Machine Learning"}
        features['has_high_demand_skills'] = len(set(technical_skills) & high_demand)

        return features

    def features_to_vector(self, features):
        """Convert feature dict to feature vector"""
        feature_order = [
            'num_technical_skills', 'num_soft_skills', 'num_missing_skills',
            'num_jobs', 'total_experience_months', 'avg_job_duration',
            'gpa', 'has_degree', 'num_projects', 'num_certifications',
            'skill_diversity', 'has_high_demand_skills'
        ]
        return np.array([[features.get(f, 0) for f in feature_order]])

    def train(self, dataset):
        """Train the model on dataset"""
        print("Extracting features from dataset...")
        X_list = []
        y_scores = []
        y_levels = []

        for resume in dataset:
            features = self.extract_features(resume)
            X_list.append(self.features_to_vector(features)[0])
            y_scores.append(resume.get('expected_score', 75))
            level_map = {'junior': 0, 'mid': 1, 'senior': 2}
            y_levels.append(level_map.get(resume.get('quality_level', 'mid'), 1))

        X = np.array(X_list)
        y_scores = np.array(y_scores)
        y_levels = np.array(y_levels)

        print(f"Training on {len(X)} samples...")

        
        self.score_model = RandomForestRegressor(n_estimators=50, random_state=42, max_depth=10)
        self.score_model.fit(X, y_scores)

        
        self.level_model = RandomForestClassifier(n_estimators=50, random_state=42, max_depth=10)
        self.level_model.fit(X, y_levels)

        
        score_pred = self.score_model.predict(X)
        level_pred = self.level_model.predict(X)

        mse = mean_squared_error(y_scores, score_pred)
        accuracy = accuracy_score(y_levels, level_pred)

        print(f"Score Model MSE: {mse:.4f}")
        print(f"Level Model Accuracy: {accuracy:.4f}")

        return self

    def predict(self, resume_text, target_role="Software Engineer"):
        """Predict score and analysis for a resume"""
        
        
        technical_skills = [skill for skill in ALL_SKILLS if skill.lower() in resume_text.lower()]
        soft_skills = [skill for skill in SOFT_SKILLS if skill.lower() in resume_text.lower()]

        
        synthetic_resume = {
            'technical_skills': technical_skills,
            'soft_skills': soft_skills,
            'missing_skills': [s for s in ALL_SKILLS if s not in technical_skills][:random_count(3, 7)],
            'experience': [],
            'projects': [],
            'certifications': [],
            'education': {'gpa': 3.5}
        }

        
        features = self.extract_features(synthetic_resume)
        X = self.features_to_vector(features)

        
        score = max(0, min(100, float(self.score_model.predict(X)[0])))
        level = ['Junior', 'Mid-level', 'Senior'][int(self.level_model.predict(X)[0])]

        
        missing = synthetic_resume['missing_skills'][:5]

        
        roadmap = [
            f"Master {missing[0]} (2-3 weeks)" if missing else "Strengthen core skills",
            "Build practical projects",
            "Contribute to open source",
            f"Learn {missing[1] if len(missing) > 1 else 'advanced topics'} (3 weeks)"
        ]

        return {
            'score': int(score),
            'level': level,
            'skills': technical_skills,
            'missingSkills': missing,
            'roadmap': roadmap,
            'recommendedCourses': [
                f"YouTube: {technical_skills[0] if technical_skills else 'Programming'} Tutorial by Traversy Media" if technical_skills else "YouTube: Python Full Course by FreeCodeCamp",
                "YouTube: System Design Tutorial by Exponent",
                "YouTube: Data Structures & Algorithms by FreeCodeCamp",
                "YouTube: Full Stack Development by Traversy Media"
            ]
        }

    def save(self, filepath='models/resume_model.pkl'):
        """Save model to file"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump({
                'score_model': self.score_model,
                'level_model': self.level_model
            }, f)
        print(f"Model saved to {filepath}")

    @staticmethod
    def load(filepath='models/resume_model.pkl'):
        """Load model from file"""
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
        analyzer = ResumeAnalyzer()
        analyzer.score_model = data['score_model']
        analyzer.level_model = data['level_model']
        return analyzer


def random_count(min_val, max_val):
    """Helper to get random count"""
    import random
    return random.randint(min_val, max_val)


if __name__ == "__main__":
    
    print("Loading synthetic dataset...")
    with open('data/synthetic_resumes.json', 'r') as f:
        dataset = json.load(f)

    
    analyzer = ResumeAnalyzer()
    analyzer.train(dataset)

    
    analyzer.save('models/resume_model.pkl')

    
    test_resume = """
    Software engineer with 5 years of experience in Python, JavaScript, React, and AWS.
    Experienced in Docker, Kubernetes, and cloud architecture.
    Strong problem-solving and leadership skills.
    """
    result = analyzer.predict(test_resume)
    print("\nTest Prediction:")
    print(json.dumps(result, indent=2))
