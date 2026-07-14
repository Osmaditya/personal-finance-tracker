# Finance Tracker

A full-stack personal finance tracking application built to help you manage your expenses, track your income, and visualize your financial health.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript, built with Vite
- **UI & Styling:** Material UI (MUI), Emotion
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **Forms & Validation:** React Hook Form, Zod
- **Data Visualization:** Recharts
- **HTTP Client:** Axios
- **Date Utility:** date-fns

### Backend
- **Framework:** Django & Django REST Framework (DRF)
- **Database:** PostgreSQL (supports SQLite out of the box for development)
- **Authentication:** JWT (JSON Web Tokens) via `djangorestframework-simplejwt`
- **Utilities:** OpenPyXL (Excel integration), ReportLab (PDF generation), Django Filter, CORS Headers

## 📂 Project Structure

- `/frontend`: Contains the React & Vite single-page application.
- `/finance-tracker-backend`: Contains the Django REST API backend.

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Python](https://www.python.org/) (v3.10+ recommended)
- PostgreSQL (optional, if using Postgres instead of the default SQLite)

## 🛠️ Getting Started

Follow these instructions to set up the project locally.

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd finance-tracker-backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   - Copy the `.env.example` file and rename it to `.env`.
   - Update the variables as needed.
5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```
   The backend API will run on `http://localhost:8000/`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Ensure the `VITE_API_BASE_URL` (or equivalent) points to your local backend API.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000/`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
