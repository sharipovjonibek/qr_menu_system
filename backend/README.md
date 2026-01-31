## Backend Setup for Frontend Developer

This section explains how to set up the Django REST Framework backend locally to test the frontend React app

### 1.Clone the Repository
```bash
git clone https://github.com/sharipovjonibek/qr_menu_system.git
cd backend
```

### 2.Create a Virtual Environment

To install virtual tool on our system
```bash
pip install virtualenv
```

To create a virtual environment in our system 
```bash
virtualenv venv
```

Activate the virtual environment:
```bash
venv\Scripts\activate
```

### 3.Install Dependencies
```bash
pip install -r requirements.txt
```

### 4.Apply Database Migrations
```bash
python manage.py migrate
```

### 5.Run the Development Server
```bash
python manage.py runserver
```
- Backend will run at `http://127.0.0.1:8000/`
- API endpoints:
    -  `http://127.0.0.1:8000/api/session/active/<table_number>`  -  Check active session
    -  `http://127.0.0.1:8000/api/session/start` -  Start a table session
    -  `http://127.0.0.1:8000/api/menu`  -  Get menu by session token
