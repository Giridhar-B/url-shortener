# URL Shortener

A full-stack URL Shortener web application built using the MERN stack with authentication, analytics, QR code generation, Redis caching, and a modern responsive dashboard UI.

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### URL Shortening
- Generate Short URLs
- Custom Alias Support
- URL Normalization
- URL Expiration Support
- Redirect to Original URL

### Link Management
- View All Links
- Delete Single Link
- Delete All Links
- Activate / Deactivate Links
- Link Status Indicators

### Analytics
- Total Links
- Total Clicks
- Active Links
- Expired Links
- Top Clicked Links
- Per-Link Analytics
- 7 Days Analytics
- 30 Days Analytics
- All Time Analytics
- Click Activity Charts

### QR Features
- QR Code Generation
- QR Code Download

### UI / UX
- Responsive Dashboard
- Modern Card UI
- Toast Notifications
- Hover Tooltips
- Analytics Charts
- Browser Tab Icon

### Performance
- Redis Caching
- Optimized MongoDB Aggregations
- Auto Refresh Dashboard

---

# Tech Stack

## Frontend
- React.js
- Vite
- Axios
- Recharts
- QRCode React
- Lucide React Icons

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- JWT Authentication

---

# Project Structure

```bash
URL_Shortener/
│
├── frontend/
│
├── server/
│
├── .gitignore
│
└── README.md
```

---

# Environment Variables

## Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_REDIRECT_BASE_URL=http://localhost:5000
```

## Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
BASE_URL=http://localhost:5000
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

# Installation

## Clone Repository

```bash
git clone <your_repository_url>
cd URL_Shortener
```

---

## Backend Setup

```bash
cd server

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# API Routes

## Authentication

### Register
```http
POST /api/auth/register
```

### Login
```http
POST /api/auth/login
```

---

## Links

### Create Short URL
```http
POST /api/links
```

### Get All Links
```http
GET /api/links
```

### Delete Link
```http
DELETE /api/links/:id
```

### Toggle Link Status
```http
PATCH /api/links/toggle/:id
```

---

## Analytics

### Global Analytics
```http
GET /api/analytics
```

### Per-Link Analytics
```http
GET /api/analytics/:code
```

---

# Future Improvements
- Custom Expiration Duration UI
- User Profile Management
- Advanced Analytics Filters
- Geographic Click Tracking
- Device / Browser Analytics
- Dark Mode Support

---

# Author
**Giridhar B**  
[GitHub Profile](https://github.com/Giridhar-B)  
[GitHub Profile](https://url-shortener-one-lemon.vercel.app/) 
