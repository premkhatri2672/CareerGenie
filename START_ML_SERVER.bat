@echo off
title CareerGenie ML API Server Setup
echo ================================================
echo CareerGenie ML Resume Analyzer API Server Setup
echo ================================================

cd ml_model

echo [1/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python not found! Please install Python 3.8+ and add it to PATH.
    pause
    exit /b 1
)
echo Python detected successfully!

if not exist "venv" (
    echo [2/5] Creating virtual environment...
    python -m venv venv
    echo Virtual environment created successfully.
) else (
    echo [2/5] Virtual environment already exists.
)

echo [3/5] Activating virtual environment...
call venv\Scripts\activate.bat

echo [4/5] Installing/verifying dependencies...
pip install -r requirements.txt

if not exist "models\resume_model.pkl" (
    echo [5/5] Training ML model...
    if not exist "data\synthetic_resumes.json" (
        echo Generating synthetic resume data...
        python generate_synthetic_data.py
    )
    echo Training Random Forest model...
    python train_model.py
    echo Model trained and saved successfully!
) else (
    echo [5/5] Model already trained.
)

echo ================================================
echo Setup complete! Starting Flask API server...
echo URL: http://localhost:5000
echo ================================================
python api_server.py
