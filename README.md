# 🏋️ GymFlow – Gym Management System

**GymFlow** is a full-stack Gym Management System designed to simplify gym operations by bringing member management, membership subscriptions, payments, attendance tracking, trainers, and workout management into one platform.

Built with **React, Django REST Framework, and MySQL**, GymFlow provides an organized way for gym administrators to manage daily activities while allowing members to access their gym information.

---

## 🚀 Features

### 👨‍💼 Admin Dashboard
- Overview of gym operations.
- Total members and membership statistics.
- Revenue tracking and analytics.
- Revenue, member growth, and membership plan charts.
- Recent activities and payment records.
- Membership expiry notifications and urgent alerts.

### 👥 Member Management
- Register and manage gym members.
- View member profiles.
- Search and filter members.
- Activate and deactivate member accounts.
- View membership and payment history.

### 📋 Membership Management
- Create and manage membership plans.
- Assign subscriptions to members.
- Track active, pending, and expired subscriptions.
- Renew and manage memberships.
- Monitor upcoming membership expirations.

### 💳 Payment Management
- Record and track membership payments.
- View payment history.
- Search and filter payment records.
- Monitor successful, pending, and failed payments.
- M-Pesa STK Push payment integration.
- Track M-Pesa transaction receipts.

### 🕒 Attendance Management
- Record member attendance.
- Track gym check-ins.
- View attendance records.

### 🏋️ Workout Management
- Create and manage workout programs.
- Manage exercises.
- Assign workouts to members.
- Set workout durations and difficulty levels.
- Allow members to view their assigned workouts.

### 🧑‍🏫 Trainer Management
- Register and manage trainers.
- View trainer information.
- Search and filter trainers.
- Activate and deactivate trainers.

### 🔐 Authentication and Security
- User registration and login.
- Session-based authentication.
- Role-based access for administrators and members.
- Protected application pages.

---

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- Recharts
- React Router

### Backend
- Python
- Django
- Django REST Framework
- MySQL
- Django Session Authentication

### Payment Integration
- M-Pesa Daraja API
- STK Push

### Development Tools
- Visual Studio Code
- MySQL Workbench
- Git
- GitHub
- Postman

---

## 📁 Project Structure

```text
GymFlow/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## ⚙️ Installation and Setup

Follow these steps to run GymFlow locally.

### 1. Clone the Repository

```bash
git clone https://github.com/mwendwak439/GymFlow.git
```

Navigate into the project:

```bash
cd GymFlow
```

### 2. Backend Setup

Navigate into the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Configure your MySQL database and Django environment variables.

Run migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

Backend runs at:

`http://localhost:8000/`

### 3. Frontend Setup

Open another terminal and navigate into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local frontend address displayed in your terminal.

---

## 🗄️ Database Configuration

GymFlow uses MySQL for data storage.

Create a MySQL database and configure your Django database settings using your local credentials.

Example database name:

```text
gymflow_db
```

Make sure your database configuration and environment variables match your local setup.

---

## 🔑 Environment Variables

Configure your local environment variables for sensitive settings, including:

- Django secret key.
- Database credentials.
- M-Pesa Daraja API credentials.
- Payment callback URL.
- Frontend and backend API configuration.

**Important:** Never upload secret keys, passwords, database credentials, or live payment credentials to GitHub.

---

## 🎨 User Interface

GymFlow uses a modern **Dark Iron** design theme featuring:

- Charcoal and dark steel backgrounds.
- Volt green highlights.
- Clean dashboard layouts.
- Responsive components.
- Clear data visualization.

---

## 🔮 Future Improvements

Potential future enhancements include:

- Gym class scheduling and booking.
- Further improvements to mobile responsiveness.
- Automated deployment and production monitoring.
- Additional reporting and analytics.

---

## 👨‍💻 Developer

**Developed as a full-stack web development project.**

Technologies: React, Django REST Framework, Python, and MySQL.

---

## 📜 License

This project is available for educational and portfolio purposes. Add a formal license if you intend to distribute or reuse it under specific terms.
