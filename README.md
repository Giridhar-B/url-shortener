# 🔗 URL Shortener — MERN Stack Project

A modern and feature-rich **URL Shortener** web app built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
It allows users to shorten long URLs, create **custom short links**, view **click analytics**, and generate **QR codes** for easy sharing.

---

## 🚀 Project Overview

This project helps users generate compact, shareable URLs from long links.  
It includes **custom alias creation**, **click tracking**, and **analytics** like total clicks and last accessed time.  
You can also generate a **QR code** for any shortened link, making it ideal for both personal and business sharing.

---

## ✨ Features

✅ **Shorten any URL** — Paste any long link and get a unique short one instantly.  
✅ **Custom alias** — Create your own memorable short link (e.g., `/mybrand`).  
✅ **Click tracking** — Every click is tracked and stored in the database.  
✅ **Analytics dashboard** — View total clicks and last accessed timestamps.  
✅ **QR Code generation** — Instantly generate and download QR codes for any link.  
✅ **Copy to clipboard** — One-click copy for easy sharing.  
✅ **Responsive design** — Works perfectly across all devices.  
✅ **Secure backend** — Built using Express.js and MongoDB for scalability.

---

## 🧱 Tech Stack

**Frontend:**  
- React.js  
- Axios  
- Tailwind CSS (optional styling layer)

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (Mongoose ORM)

**Other Tools:**  
- NanoID (for unique short IDs)  
- QRCode (for QR generation)  
- dotenv (for environment variables)  
- CORS, Nodemon, Axios

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Giridhar-B/url-shortener.git
cd url-shortener
```
### 2️⃣ Setup the server
```bash
cd server
npm install
```

Create a .env file inside the server folder:

```bash
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
PORT=5000
```

Then run the server:

```bash
npm start
```

### 3️⃣ Setup the client
```bash
cd ../client
npm install
```

Create a .env file inside the client folder:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

Then start the client:

```bash
npm run dev
```

---
## 👨‍💻 Author
**Giridhar B**  
[GitHub Profile](https://github.com/Giridhar-B)
