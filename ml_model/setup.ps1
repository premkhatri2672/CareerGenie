# Setup script for Resume Analyzer ML Model

Write-Host "Setting up Resume Analyzer ML Model..." -ForegroundColor Green

# Check if Python is installed
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://www.python.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "Python found: $($pythonCmd.Source)" -ForegroundColor Green

# Create virtual environment
Write-Host "`nCreating virtual environment..." -ForegroundColor Cyan
python -m venv venv

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1

# Install requirements
Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Generate synthetic data
Write-Host "`nGenerating synthetic resume data..." -ForegroundColor Cyan
python generate_synthetic_data.py

# Train the model
Write-Host "`nTraining ML model..." -ForegroundColor Cyan
python train_model.py

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Setup complete! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nTo start the API server, run:" -ForegroundColor Yellow
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  python api_server.py" -ForegroundColor White

Write-Host "`nThe API will be available at: http://localhost:5000" -ForegroundColor Yellow
