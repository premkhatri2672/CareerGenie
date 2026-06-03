# CareerGenie 🧞‍♂️ — AI-Powered Career Intelligence

CareerGenie is a premium, interactive web application that helps developers evaluate their skills, scan resumes, and map out personalized paths to target roles. 

It combines a **React frontend** with a **Python Machine Learning server** and a **Supabase database** to deliver real-time salary insights, skill gaps, learning roadmaps, and curated course recommendations.

---

## 🚀 Key Features

* **AI Resume Analyzer**: Beautiful multi-step document scanner, circular ATS readiness ring, and skills extraction.
* **Skill Gap Analysis**: Target profile selector with autocomplete suggestions. Input your current skills to isolate exactly what to learn.
* **Personalized Timeline Roadmaps**: Step-by-step career path matching your current score (Junior, Mid-level, Senior).
* **Clickable Course Mapping**: Hand-picked tutorial videos from YouTube, Udemy, and Coursera linked to your missing technologies.
* **Interactive Dashboard**: Premium dark-mode glassmorphism interface with smooth hover animations, statistics, and historical logs.
* **Trained ML Predictor**: Backend Random Forest regressor/classifier predicting readiness scores based on resume syntax.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, vanilla CSS, Framer Motion, GSAP
* **Database & Auth**: Supabase (fully secured with Row Level Security)
* **Backend**: Flask (Python 3.10+), Scikit-Learn, Pandas, NumPy

---

## ⚙️ Setup & Installation

### 1. Database Configuration
1. Create a project on [Supabase](https://supabase.com/).
2. Run the SQL schema in [SETUP-DATABASE.sql](file:///d:/CareerGenie/SETUP-DATABASE.sql) using the Supabase SQL Editor. This will configure the tables, triggers, and Row Level Security.

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_ML_API_URL=http://127.0.0.1:5000
VITE_OPENAI_API_KEY=your-openai-api-key-optional
```

### 3. Start Backend ML Server (Python)
Double-click **`START_ML_SERVER.bat`** (Windows) or run the PowerShell script:
```powershell
.\START_ML_SERVER.ps1
```
This script will:
* Set up a Python virtual environment (`ml_model/venv`)
* Install all libraries in `requirements.txt`
* Generate synthetic training data and train the Random Forest model
* Start the Flask API server on `http://127.0.0.1:5000`

### 4. Start Frontend Client (Vite React)
Install dependencies and launch the client:
```bash
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📝 License
This project is open-source and available under the MIT License.
