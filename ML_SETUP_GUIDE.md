# ML Resume Analyzer - Setup Guide

This guide walks you through setting up and running the ML resume analyzer for CareerGenie.

## Overview

The system consists of:
1. **ML Model** (Python) - Analyzes resumes and returns scores, skills, and recommendations
2. **Flask API Server** - Exposes the model as HTTP endpoints
3. **React Frontend** (CareerGenie) - Calls the API when analyzing resumes

## Prerequisites

- Python 3.8 or higher ([download](https://www.python.org/downloads/))
- Node.js 16+ (already have for React development)
- Git

## Setup Steps

### Step 1: Set Up ML Model

Open PowerShell and navigate to the ml_model directory:

```powershell
cd d:\careergenie\ml_model
```

Run the automated setup script:

```powershell
.\setup.ps1
```

This will:
- Create a Python virtual environment
- Install all dependencies
- Generate 200 synthetic student resumes
- Train the Random Forest ML model
- Save the trained model

**Manual Setup (if script fails):**

```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Generate data
python generate_synthetic_data.py

# Train model
python train_model.py
```

### Step 2: Start the ML API Server

In the same PowerShell window (ml_model directory):

```powershell
# Make sure venv is activated
.\venv\Scripts\Activate.ps1

# Start the server
python api_server.py
```

You should see:
```
Starting Resume Analyzer API server...
Available endpoints:
  GET  / - API documentation
  GET  /api/health - Health check
  POST /api/analyze - Analyze resume
  POST /api/train - Train model

Server running on http://localhost:5000
```

**Keep this terminal open.** The API server needs to be running while you use the app.

### Step 3: Start the React Frontend

Open a new PowerShell window and navigate to the CareerGenie directory:

```powershell
cd d:\careergenie\CareerGenie
npm install  # Only needed first time
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is busy).

## Testing

### Test 1: API Health Check
Open your browser and visit: `http://localhost:5000/api/health`

You should see:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Test 2: Upload a Resume in CareerGenie

1. Go to Dashboard in the app
2. Click "📄 Scan Resume" button
3. Upload a PDF or DOCX resume
4. Click "Analyze Resume"
5. You should see the score, skills, and recommendations

If the ML API is not available, it will fall back to OpenAI.

## File Structure

```
careergenie/
├── CareerGenie/              # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeAnalyzer.jsx
│   │   ├── lib/
│   │   │   ├── openai.js     # MODIFIED: now calls ML API
│   │   │   └── ...
│   │   └── ...
│   ├── .env                  # MODIFIED: added VITE_ML_API_URL
│   └── package.json
│
└── ml_model/                 # ML Model (Python)
    ├── generate_synthetic_data.py
    ├── train_model.py
    ├── api_server.py
    ├── requirements.txt
    ├── setup.ps1
    ├── README.md
    ├── data/
    │   └── synthetic_resumes.json (generated)
    └── models/
        └── resume_model.pkl (generated)
```

## How It Works

1. **User uploads resume** in ResumeAnalyzer.jsx
2. **Resume is parsed** to extract text (using pdf-parse)
3. **Text is sent to ML API** at `POST /api/analyze`
4. **ML Model analyzes** resume:
   - Extracts skills mentioned
   - Calculates compatibility score
   - Identifies missing skills
   - Generates learning roadmap
5. **Results returned** in JSON format
6. **UI displays** the analysis (no UI changes)

## Troubleshooting

### Problem: "Cannot connect to localhost:5000"
- Make sure the Flask server is running: `python api_server.py`
- Check that no other app is using port 5000
- Check firewall settings

### Problem: "Model not loaded"
- Run `python train_model.py` in the ml_model directory
- Check that `models/resume_model.pkl` exists

### Problem: "ModuleNotFoundError: No module named 'flask'"
- Make sure virtual environment is activated: `.\venv\Scripts\Activate.ps1`
- Run `pip install -r requirements.txt`

### Problem: Python not found
- Install Python 3.8+ from https://www.python.org
- Make sure to check "Add Python to PATH" during installation
- Restart PowerShell after installation

### Problem: Port 5000 already in use
Edit `api_server.py`, change the last line:
```python
app.run(debug=True, port=5001, host='0.0.0.0')  # Change 5000 to 5001
```

Then update `.env` in CareerGenie:
```
VITE_ML_API_URL=http://localhost:5001
```

## Running in Production

For production deployment, you would:

1. Train the model on a larger dataset
2. Deploy the Flask API to a cloud platform (Heroku, AWS, GCP, etc.)
3. Update the `VITE_ML_API_URL` to point to the production API
4. Build and deploy the React app

## Next Steps

- Explore the synthetic data: `data/synthetic_resumes.json`
- Check model accuracy: `train_model.py` output
- Fine-tune the model by editing `train_model.py`
- Add more training data for better accuracy

## Support

For issues or questions:
1. Check the `ml_model/README.md` for ML-specific details
2. Check the logs in both Flask and React consoles
3. Verify all files exist and dependencies are installed

Happy analyzing! 🚀
