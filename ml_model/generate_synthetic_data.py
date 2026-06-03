import json
import random
from datetime import datetime, timedelta

# Technical skills database
TECHNICAL_SKILLS = [
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

ROLES = [
    "Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
    "Data Scientist", "DevOps Engineer", "Machine Learning Engineer", "Cloud Architect",
    "Security Engineer", "Mobile Developer", "QA Engineer", "Product Manager"
]

COMPANIES = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Tesla", "Airbnb",
    "Uber", "Spotify", "GitHub", "GitLab", "IBM", "Oracle", "Salesforce", "Adobe",
    "LinkedIn", "Twitter", "Pinterest", "Slack", "Stripe", "Shopify", "Figma", "Canva",
    "Notion", "MongoDB", "HashiCorp", "Terraform", "DataDog", "Twilio", "SendGrid"
]

EDUCATION = [
    "Bachelor of Science in Computer Science",
    "Bachelor of Technology in Information Technology",
    "Master of Science in Computer Science",
    "Bachelor of Science in Engineering",
    "Diploma in Computer Engineering",
    "Bachelor of Arts in Computer Science",
    "Master of Technology in Software Engineering"
]

def generate_resume(student_id, quality_level=None):
    """Generate a synthetic student resume"""

    if quality_level is None:
        quality_level = random.choice(['junior', 'mid', 'senior'])

    # Determine skills based on quality
    if quality_level == 'junior':
        num_skills = random.randint(3, 6)
        experience_years = random.randint(0, 2)
        score = random.randint(40, 65)
    elif quality_level == 'mid':
        num_skills = random.randint(6, 10)
        experience_years = random.randint(2, 5)
        score = random.randint(65, 82)
    else:  # senior
        num_skills = random.randint(10, 15)
        experience_years = random.randint(5, 15)
        score = random.randint(82, 95)

    selected_skills = random.sample(TECHNICAL_SKILLS, num_skills)
    selected_soft_skills = random.sample(SOFT_SKILLS, random.randint(2, 4))

    # Generate work experience
    experiences = []
    for i in range(random.randint(1, 4)):
        start_year = datetime.now().year - experience_years + i
        duration = random.randint(1, 3)
        experiences.append({
            "company": random.choice(COMPANIES),
            "role": random.choice(ROLES),
            "start_date": f"{start_year}-{random.randint(1, 12):02d}",
            "end_date": f"{start_year + duration}-{random.randint(1, 12):02d}",
            "duration_months": duration * 12 + random.randint(0, 11)
        })

    # Generate projects
    projects = []
    for i in range(random.randint(1, 3)):
        num_tech = min(random.randint(2, 4), len(selected_skills))
        projects.append({
            "name": f"Project {i+1}: {['Web App', 'Mobile App', 'ML Pipeline', 'Data Platform', 'API Service'][random.randint(0, 4)]}",
            "technologies": random.sample(selected_skills, max(1, num_tech)),
            "description": f"Developed a {random.choice(['scalable', 'responsive', 'intelligent', 'efficient', 'secure'])} solution"
        })

    resume = {
        "id": student_id,
        "name": f"Student {student_id}",
        "email": f"student{student_id}@university.edu",
        "phone": f"+1-{random.randint(200, 999)}-{random.randint(200, 999)}-{random.randint(1000, 9999)}",
        "summary": f"Passionate {random.choice(ROLES)} with expertise in {', '.join(selected_skills[:3])}",
        "education": {
            "degree": random.choice(EDUCATION),
            "institution": f"University {random.randint(1, 50)}",
            "year": datetime.now().year - random.randint(0, 4),
            "gpa": round(random.uniform(2.5, 4.0), 2)
        },
        "technical_skills": selected_skills,
        "soft_skills": selected_soft_skills,
        "experience": experiences,
        "projects": projects,
        "certifications": random.sample(
            ["AWS Certified Solutions Architect", "Kubernetes Certified", "Google Cloud Professional",
             "Azure Fundamentals", "Docker Certification", "TensorFlow Developer"],
            random.randint(0, 3)
        ),
        "quality_level": quality_level,
        "expected_score": score,
        "missing_skills": random.sample(
            [s for s in TECHNICAL_SKILLS if s not in selected_skills],
            random.randint(3, 7)
        )
    }

    return resume

def generate_dataset(num_resumes=200):
    """Generate a dataset of synthetic resumes"""
    dataset = []

    # Generate balanced dataset
    for level in ['junior', 'mid', 'senior']:
        count = num_resumes // 3
        for i in range(count):
            student_id = len(dataset) + 1
            resume = generate_resume(student_id, quality_level=level)
            dataset.append(resume)

    return dataset

if __name__ == "__main__":
    print("Generating synthetic resume dataset...")
    dataset = generate_dataset(num_resumes=200)

    # Save to file
    with open('data/synthetic_resumes.json', 'w') as f:
        json.dump(dataset, f, indent=2)

    print(f"Generated {len(dataset)} synthetic resumes")
    print(f"Saved to data/synthetic_resumes.json")

    # Print sample
    print("\nSample Resume:")
    print(json.dumps(dataset[0], indent=2))
