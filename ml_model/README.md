# Resume Analyzer ML Model

This directory contains the machine learning model for analyzing student resumes.

## Components

1. **generate_synthetic_data.py** - Generates 200 synthetic student resumes for training
2. **train_model.py** - Trains a Random Forest model on the synthetic data
3. **api_server.py** - Flask API server that exposes the model as HTTP endpoints
4. **requirements.txt** - Python dependencies

## Setup Instructions

### Option 1: Automated Setup (Windows PowerShell)

Run the setup script:
```powershell
.\setup.ps1
```

This will:
- Create a Python virtual environment
- Install dependencies
- Generate synthetic data
- Train the model

### Option 2: Manual Setup

1. **Install Python 3.8+** from https://www.python.org

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1

   # Windows Command Prompt
   .\venv\Scripts\activate.bat

   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Generate synthetic data:**
   ```bash
   python generate_synthetic_data.py
   ```

6. **Train the model:**
   ```bash
   python train_model.py
   ```

## Running the API Server

1. **Activate the virtual environment** (if not already active)
2. **Start the server:**
   ```bash
   python api_server.py
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### GET /api/health
Check if the API and model are ready.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### POST /api/analyze
Analyze a resume and return predictions.

**Request Body:**
```json
{
  "text": "Resume content as plain text...",
  "target_role": "Software Engineer" (optional)
}
```

**Response:**
```json
{
  "score": 85,
  "level": "Mid-level",
  "skills": ["Python", "JavaScript", "React", ...],
  "missingSkills": ["TypeScript", "Kubernetes", ...],
  "roadmap": [
    "Master TypeScript (2-3 weeks)",
    "Build practical projects",
    ...
  ],
  "recommendedCourses": [
    "Advanced Python",
    "System Design Fundamentals",
    ...
  ]
}
```

## Model Details

The model uses:
- **RandomForestRegressor** for score prediction (0-100)
- **RandomForestClassifier** for level classification (Junior/Mid/Senior)
- Feature extraction from resume structure, experience, and skills
- Trained on 200 synthetic student resumes

### Features Extracted:
- Number of technical and soft skills
- Years of experience
- Education level (GPA)
- Number of projects and certifications
- Skill diversity
- High-demand skills presence

## Frontend Integration

The CareerGenie React app calls the ML API when analyzing resumes:

1. User uploads resume in ResumeAnalyzer component
2. Resume is parsed to extract text
3. Text is sent to `/api/analyze` endpoint
4. Model analyzes and returns score + suggestions
5. Results displayed in the UI (no UI changes)

## Troubleshooting

### Model not found error
Run: `python train_model.py` to train the model

### Port 5000 already in use
Change the port in `api_server.py`:
```python
app.run(debug=True, port=5001, host='0.0.0.0')
```

### Import errors
Make sure virtual environment is activated and dependencies are installed:
```bash
pip install -r requirements.txt
```

## Future Improvements

- Fine-tune hyperparameters
- Add more training data
- Use deep learning models (TensorFlow/PyTorch)
- Implement skill gap analysis
- Add industry-specific scoring
