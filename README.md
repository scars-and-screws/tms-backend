# 🚀 Task Management System (Backend)

A production-ready backend system built with a modular architecture, featuring authentication, RBAC, organization management, and advanced security mechanisms.

---

## 🧠 Highlights

- 🔐 Advanced Authentication System (JWT, Sessions, 2FA, OTP)
- 🏢 Multi-tenant Organization Support
- 👥 Role-Based Access Control (RBAC)
- 📦 Modular & Scalable Architecture
- 🛡️ Security-focused design (device tracking, fingerprinting)

---

## 🚧 Ongoing Development

Currently expanding the system with:

- 📋 Task management module  
- 💬 Task comments & collaboration system  
- 👥 Advanced role-based permissions for teams  

---

## 🏗️ Architecture Overview

This project follows a **modular + layered architecture**:

```
src/
 ├── core/        → Shared infrastructure (security, middleware, utils)
 ├── modules/     → Feature-based modules (auth, users, organizations)
```

### 🔑 Design Principles

- Feature-based modular structure  
- Separation of concerns  
- Scalable & maintainable codebase  
- Reusable core utilities  

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
- API response standardization  
- Request metadata handling  

---

## 📦 Modules

### 🔑 Auth Module
- Login / Register  
- Email verification  
- Password reset  
- Two-Factor Authentication (2FA)  
- Session management  

### 👤 User Module
- User profile management  
- Avatar upload (Cloudinary)  

### 🏢 Organization Module
- Multi-tenant organization system  
- Member roles & permissions  
- Organization-level RBAC  

---

## 🛠 Tech Stack

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,postgres,prisma,js,git,linux" />
</p>

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```
git clone https://github.com/scars-and-screws/tms-backend.git
cd tms-backend
```

### 2. Install dependencies
```
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```
# PORT
PORT=5000

# NODE ENVIRONMENT
NODE_ENV=development

# DATABASE
DATABASE_URL="your-database-url-here"

# PASSWORD HASHING
SALT_ROUNDS=10

# JWT AUTH
JWT_ACCESS_TOKEN_SECRET="your-access-token-secret-here"
JWT_ACCESS_TOKEN_EXPIRATION=15m

JWT_REFRESH_TOKEN_SECRET="your-refresh-token-secret-here"
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
RESEND_API_KEY="your-resend-api-key-here"

# CLOUDINARY
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name-here"
CLOUDINARY_API_KEY="your-cloudinary-api-key-here"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret-here"
CLOUDINARY_URL="your-cloudinary-url-here"
```

---

### 4. Run the server
```
npm run dev
```

---

## 🔐 Key Concepts Demonstrated

- Authentication (JWT, sessions, refresh tokens)  
- Authorization (RBAC, organization roles)  
- Multi-tenant system design  
- Modular backend architecture  
- Security best practices  

---

## 📡 API Documentation (Planned)

API documentation using Swagger will be added after core modules are completed to ensure accurate and stable documentation.

---

## 📈 Future Improvements

- API documentation (Swagger)  
- Rate limiting & throttling  
- Logging & monitoring  
- Docker & deployment setup  

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐

---

> Code. Build. Break. Learn. Repeat.
