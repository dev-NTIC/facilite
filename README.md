# Stream System - Node.js Backend

Complete Express.js backend for Stream TV Financing System.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
mysql -u root -p < database.sql
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Create Required Folders
```bash
mkdir documents
mkdir -p public/css
mkdir -p public/js
mkdir views
```

### 5. Start Server
```bash
npm start
```

Or development mode:
```bash
npm run dev
```

### 6. Access Application
- Homepage: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Dashboard: http://localhost:3000/dashboard

## 🔐 Default Login

```
Phone: 0551316015
Password: 123456
```

## 📁 Project Structure

```
stream-system-backend/
├── app.js
├── package.json
├── .env.example
├── database.sql
├── config/
│   ├── db.js
│   ├── authCheck.js
│   └── multer.js
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   └── financing.js
├── controllers/
│   ├── authController.js
│   ├── dashboardController.js
│   └── financingController.js
├── models/
│   └── financingModel.js
├── views/
│   └── (EJS templates to be added)
├── public/
│   ├── css/
│   └── js/
└── documents/
```

## 📝 Features

- Express.js server
- EJS templating
- MySQL database
- Session-based authentication
- File upload with Multer
- Multi-step financing form
- Status management
- Document storage

## 🛠️ Technologies

- Node.js
- Express.js
- EJS
- MySQL
- Multer
- Express-session
- dotenv

---

Created with ❤️ for Stream System
