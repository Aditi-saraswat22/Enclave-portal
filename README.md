# Enclave Secure Contact Portal

A secure contact form and administration dashboard built with **React (Vite)** on the frontend and **Node.js (Express) + MongoDB** on the backend.

---

## Features
- **Secure File Attachments**: Users can attach documents (PDF, DOCX, TXT) and images (JPG, PNG, WEBP), which are uploaded to Cloudinary.
- **Admin Email Notifications**: Automatic Nodemailer alerts are sent to the administrator when new contact messages arrive.
- **Admin Dashboard**: A secure, debounced search dashboard allowing the admin to filter, view, download attachments, and delete messages.
- **Resilient Fallbacks**: Runs smoothly out of the box even without setup of SMTP or Cloudinary credentials.
- **Full Docker Support**: Dev/Prod multi-stage setups and containerized MongoDB databases.

---

## 🛠️ Local Development (Standard Setup)

### 1. Prerequisite Config
Create a `.env` file in the `server` directory:
```env
PORT=8888
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/secure-contact-db

# Optional integrations
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ADMIN_EMAIL=
```

Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:8888/api
```

### 2. Run Backend
```bash
cd server
npm install
npm run dev
```
The server will run on `http://localhost:8888`.

### 3. Run Frontend
```bash
cd client
npm install
npm run dev
```
The application will run on `http://localhost:5173`.

---

## 🐳 Docker Deployment (Local Development)

The project includes a fully containerized architecture that runs offline and sets up a local MongoDB instance.

### Prerequisites
Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Start the Stack
From the project root directory, run:
```bash
docker compose up --build
```

This starts three services:
1. **mongodb** (local database running on port `27017`)
2. **backend** (Express server on port `8888` hot-reloading code changes)
3. **frontend** (React Vite on port `5173` with HMR enabled)

### Stop the Stack
```bash
docker compose down -v
```
*(The `-v` flag removes volumes to reset the local database, omit it to persist data).*

---

## 🚀 Production Deployment

### Backend (Docker-based)
The `server/Dockerfile` is production-optimized:
- Multi-stage build support
- Excludes development dependencies (`nodemon`, etc.) when building without development flags
- Can be deployed directly to platforms like **Render**, **Heroku**, or **Fly.io**.

### Frontend
Build the application using:
```bash
cd client
npm run build
```
And deploy the generated `dist` folder to hosts like **Vercel** or **Netlify**.
