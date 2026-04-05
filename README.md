# 🚀 Task Management System (Backend)

A scalable, production-ready backend system built with a modular architecture, focused on authentication, RBAC, and multi-tenant organization management.

---

## ✨ Key Highlights

- 🔐 Advanced Authentication (JWT, Sessions, 2FA, OTP)
- 🏢 Multi-tenant Organization Support
- 👥 Role-Based Access Control (RBAC)
- 🛡️ Security-first architecture (device tracking, fingerprinting)
- 📦 Modular & scalable code structure

---

## 🏗️ Architecture Overview

This project follows a **modular + layered architecture**:

```
src/
 ├── core/        → Shared infrastructure (security, middleware, utils)
 ├── modules/     → Feature-based modules (auth, users, organizations)
```

---

## ⚙️ Core System

### 🔐 Security Layer
- JWT access & refresh tokens  
- Device fingerprinting & session tracking  
- Secure password hashing (bcrypt)  
- Token & cookie management  

### 📩 OTP & Verification
- OTP generation & validation  
- Email verification flow  
- Retry & cooldown handling  

### 🧰 Utilities
- Centralized error handling  
- Standardized API responses  
- Request metadata handling  

---

## 📦 Modules

### 🔑 Auth Module
- User registration & login  
- Email verification  
- Password reset  
- Two-Factor Authentication (2FA)  
- Session management  

---

### 👤 User Module
- User profile management  
- Avatar upload (Cloudinary)  

---

### 🏢 Organization Module
- Multi-tenant organization system  
- Member roles & permissions  
- Organization-level RBAC  

---

## 🛠️ Tech Stack

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,postgres,prisma,js,git,linux" />
</p>

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/scars-and-screws/tms-backend.git
cd tms-backend
```

---

### 2️⃣ Install dependencies
```bash
npm install
```

---

### 3️⃣ Configure environment variables

Create a `.env` file in the root directory:

```env
# PORT
PORT=5000

# NODE ENVIRONMENT
NODE_ENV=development

# DATABASE
DATABASE_URL="your-database-url-here"

# PASSWORD HASHING
SALT_ROUNDS=10

# JWT AUTH
JWT_ACCESS_TOKEN_SECRET="your-access-token-secret"
JWT_ACCESS_TOKEN_EXPIRATION=15m

JWT_REFRESH_TOKEN_SECRET="your-refresh-token-secret"
JWT_REFRESH_TOKEN_EXPIRATION=15d

# DEVICE COOKIE
DEVICE_COOKIE_MAX_AGE=31536000000

# SESSION LIMIT
MAX_SESSIONS=7

# OTP CONFIG
OTP_LENGTH=6
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5
OTP_RESEND_COOLDOWN_SECONDS=60

# EMAIL (OPTIONAL)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
MAIL_SERVICE="gmail"

# RESEND
RESEND_API_KEY="your-resend-api-key"

# CLOUDINARY
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_URL="your-cloudinary-url"
```

---

### 4️⃣ Run the server
```bash
npm run dev
```

---

## 🔐 Key Concepts Demonstrated

- Authentication (JWT, sessions, refresh tokens)  
- Authorization (RBAC, organization roles)  
- Multi-tenant architecture  
- Secure backend design  
- Modular scalable system design  

---

## 🚧 Ongoing Development

- 📌 Task & subtask management system  
- 💬 Comments & collaboration features  
- 📊 Activity tracking & audit logs  

---

## 📈 Future Improvements

- 📄 API documentation (Swagger)  
- 🚦 Rate limiting & throttling  
- 📊 Logging & monitoring  
- 🐳 Docker & deployment setup  

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐

---

> Code. Build. Break. Learn. Repeat.
