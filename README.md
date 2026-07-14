# 💰 Finance Tracker

A modern full-stack **Personal Finance Tracker** that helps users monitor income and expenses, manage budgets, categorize transactions, and gain meaningful insights into their financial activity through interactive dashboards and reports.

---

# 🚀 Tech Stack

## Frontend
- **Framework:** React 19 + TypeScript (Vite)
- **UI Library:** Material UI (MUI) & Emotion
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Form Handling & Validation:** React Hook Form + Zod
- **Data Visualization:** Recharts
- **HTTP Client:** Axios
- **Date Utilities:** date-fns

## Backend
- **Framework:** Django & Django REST Framework (DRF)
- **Database:** PostgreSQL (SQLite supported for local development)
- **Authentication:** JWT (JSON Web Tokens) using `djangorestframework-simplejwt`
- **Additional Libraries:**
  - Django Filter
  - CORS Headers
  - OpenPyXL (Excel Export)
  - ReportLab (PDF Report Generation)

---

# 📁 Project Structure

```
Finance-Tracker/
│
├── finance-tracker-backend/   # Django REST API
├── frontend/                  # React + Vite Application
└── README.md
```

---

# ✨ Features

- 🔐 Secure JWT Authentication
- 👤 User Registration & Login
- 💵 Income & Expense Tracking
- 📂 Transaction Categories
- 🎯 Budget Management
- 📊 Interactive Dashboard & Reports
- 📈 Financial Analytics
- 📄 PDF Report Generation
- 📥 Excel Export
- 📱 Responsive User Interface

---

# ⚙️ Prerequisites

Before running the project, make sure you have installed:

- Node.js (v18 or above)
- Python (v3.10 or above)
- PostgreSQL (Optional if using PostgreSQL instead of SQLite)

---

# 🛠️ Installation & Setup

## 1️⃣ Backend Setup

Navigate to the backend folder:

```bash
cd finance-tracker-backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment

### Windows

```bash
.venv\Scripts\activate
```

### macOS/Linux

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Configure environment variables

- Create a `.env` file.
- Add the required environment variables.

Apply migrations

```bash
python manage.py migrate
```

Start the Django development server

```bash
python manage.py runserver
```

Backend will be available at

```
http://localhost:8000/
```

---

## 2️⃣ Frontend Setup

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create a `.env` file and configure the backend API URL

Example

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Run the frontend

```bash
npm run dev
```

Frontend will be available at

```
http://localhost:5173/
```

---

# 🤝 Contributing

Contributions, suggestions, and feature requests are always welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---


## ⭐ If you found this project helpful, consider giving it a star on GitHub!