# 🚀 FinTwin — AI Financial Digital Twin for MSMEs

FinTwin builds a real-time mathematical and machine learning replica of an MSME's business finances — predicting customer payment delays, stress-testing liquidity shocks, forecasting 90-day cash runways, and unlocking instant working capital.

---

## 🏗️ Architecture Overview

* **Frontend**: React 19 + Vite + Recharts + Lucide Icons + PapaParse + Universal Multi-Format Parser (CSV, Excel `.xlsx/.xls`, PDF AI OCR, JSON, TXT).
* **Backend**: FastAPI + Python 3.11 + SQLAlchemy + Scikit-Learn ML Models + Uvicorn.
* **Database**: PostgreSQL (Production) / SQLite (Resilient zero-config fallback).
* **Security & Auth**: Role-Based Access Control (Founder & CEO, CFO, Financial Controller), ISO 27001 & 256-bit AES encryption compliant.

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API docs available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend Web App available at: `http://localhost:5173/`

---

## 🐳 1-Command Docker Deployment

Deploy the entire stack (PostgreSQL + FastAPI Backend + React/Nginx Frontend) locally or on a VPS:
```bash
docker compose up --build -d
```
* **Frontend Web App**: `http://localhost:3000`
* **Backend REST API**: `http://localhost:8000`
* **PostgreSQL Database**: `localhost:5432`

---

## ☁️ Cloud Production Deployment Guide

### A. Deploy Frontend to Vercel (Recommended)
1. Push this repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variable**: `VITE_API_URL` = `https://your-backend.onrender.com`
4. Click **Deploy**. (SPA routes are automatically handled by [`vercel.json`](./frontend/vercel.json)).

### B. Deploy Backend to Render (Recommended)
1. In [Render Dashboard](https://render.com), click **"New +"** $\rightarrow$ **"Web Service"** (or use the included [`render.yaml`](./backend/render.yaml) Blueprint).
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `PYTHON_VERSION`: `3.11.8`
     - `DATABASE_URL`: `(Your PostgreSQL connection string or leave empty for auto SQLite)`
3. Click **Create Web Service**.

### C. Deploy Backend to Railway
1. In [Railway](https://railway.app), click **"New Project"** $\rightarrow$ **"Deploy from GitHub repo"**.
2. Set root directory to `backend`. Railway will automatically detect the [`Procfile`](./backend/Procfile) and [`requirements.txt`](./backend/requirements.txt).
3. Add a PostgreSQL database plugin in Railway and link `DATABASE_URL`.

---

## 🌟 Key Modules & Capabilities

| Module | Route | Key Capabilities |
| :--- | :--- | :--- |
| **Landing Page** | `/` | Interactive Sandbox Simulator, ROI Calculator, Pricing Tiers, FAQ. |
| **Authentication** | `/login` | 1-Click Executive Demo Personas (Founder, CFO, Controller) + Business Registration. |
| **Dashboard** | `/dashboard` | Executive KPI cards, 30-day velocity trajectory, receivables aging brackets. |
| **Universal Invoices** | `/invoices` | CSV, Excel (`.xlsx/.xls`), JSON, PDF AI OCR scanner, AI delay predictions. |
| **Cash Flow Twin** | `/cash-flow` | Waterfall cash bridge, scheduled collections, committed disbursements. |
| **Expenses & Burn** | `/expenses` | Categorized recurring vs variable liabilities, monthly burn rate. |
| **Customers & Risk** | `/customers` | Concentration radar, credit health risk rating, payment delays. |
| **90-Day Forecast** | `/forecast` | Probabilistic Monte Carlo confidence envelopes ($P10/P50/P90$), breach warning. |
| **What-If Simulator** | `/simulator` | One-click macro shocks (revenue drop, inflation, delay cascades) & parameter sliders. |
| **Financing Marketplace**| `/financing` | Working capital gap calculator, invoice discounting selector (98.5% net payout). |
| **Financial Reports** | `/reports` | Exportable P&L Operating Statements, Cash Flow, Aging Schedules (CSV & Print). |
| **Integrations** | `/integrations` | Sync connectors for Tally Prime, Zoho Books, GSTN, QuickBooks, Razorpay. |
| **Business Settings** | `/settings` | GSTIN setup, safety reserves, Clean-Slate Purge, and Demo Preset Loader. |
