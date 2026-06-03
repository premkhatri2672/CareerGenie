# Quick start script for ML Resume Analyzer API server

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "CareerGenie ML Resume Analyzer API Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

$mlDir = ".\ml_model"

# Check if ml_model directory exists
if (-not (Test-Path $mlDir)) {
    Write-Host "Error: ml_model directory not found!" -ForegroundColor Red
    Write-Host "Make sure to run this script from the careergenie root directory" -ForegroundColor Yellow
    exit 1
}

# Navigate to ml_model
Push-Location $mlDir

Write-Host "`n[1/5] Checking Python installation..." -ForegroundColor Yellow
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "Error: Python not found. Please install Python 3.8+" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "✓ Python found: $($pythonCmd.Source)" -ForegroundColor Green

# Check if venv exists
if (-not (Test-Path "venv")) {
    Write-Host "`n[2/5] Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "`n[2/5] Virtual environment already exists" -ForegroundColor Green
}

# Activate venv
Write-Host "`n[3/5] Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install requirements
Write-Host "`n[4/5] Installing dependencies..." -ForegroundColor Yellow
pip install -q -r requirements.txt
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Check if model exists
if (-not (Test-Path "models\resume_model.pkl")) {
    Write-Host "`n[5/5] Training ML model (this may take a minute)..." -ForegroundColor Yellow

    # Generate data if not exists
    if (-not (Test-Path "data\synthetic_resumes.json")) {
        Write-Host "  • Generating synthetic resume data..." -ForegroundColor Cyan
        python generate_synthetic_data.py | Out-Null
    }

    # Train model
    Write-Host "  • Training model..." -ForegroundColor Cyan
    python train_model.py
    Write-Host "✓ Model trained and saved" -ForegroundColor Green
} else {
    Write-Host "`n[5/5] Model already trained" -ForegroundColor Green
}

# Start server
Write-Host "`n================================================" -ForegroundColor Green
Write-Host "Setup complete! Starting API server..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "`nAPI Server Details:" -ForegroundColor Cyan
Write-Host "  • URL: http://localhost:5000" -ForegroundColor White
Write-Host "  • Health Check: http://localhost:5000/api/health" -ForegroundColor White
Write-Host "  • Docs: http://localhost:5000/" -ForegroundColor White
Write-Host "`nMake sure the React app is running:" -ForegroundColor Yellow
Write-Host "  • In another terminal: cd CareerGenie && npm run dev" -ForegroundColor White
Write-Host "`nPress Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "================================================`n" -ForegroundColor Green

# Start the server
python api_server.py
