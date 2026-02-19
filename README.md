# VyapaarSetu

VyapaarSetu is a full-stack business management platform with inventory, products, orders, POS, discounts, reports, and role-based access.

## Live Website

[https://vyapaar-setu-frontend.vercel.app](https://vyapaar-setu-frontend.vercel.app)

## Project Structure

- `frontend/` - React + Vite application (Redux, React Router, Tailwind CSS)
- `backend/` - Node.js + Express API (MongoDB, JWT auth, role permissions)

## Core Features

- Product management with bulk actions and CSV import/export
- Category and brand management
- Inventory and stock tracking
- POS checkout flow
- Orders, invoices, returns, and purchase orders
- Discounts and basic reporting
- Authentication, authorization, and role permissions

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, Mongoose, JWT, Multer, Cloudinary
- Database: MongoDB

## Getting Started

### 1. Clone repository

```bash
git clone <your-repo-url>
cd VyapaarSetu
```

### 2. Setup backend

```bash
cd backend
npm install
npm run start
```

Backend runs on `http://localhost:3000` by default.

### 3. Setup frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite dev server (typically `http://localhost:5173`).

## Environment Variables

Create `.env` files in both `backend/` and `frontend/`.

### Backend (`backend/.env`) - typical keys

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### Frontend (`frontend/.env`) - typical keys

- `VITE_API_URL` (example: `http://localhost:3000`)
- `VITE_RAZORPAY_KEY_ID`

## Available Scripts

### Frontend

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

### Backend

- `npm run start` - start API server with nodemon

## Notes

- Keep frontend `VITE_API_URL` aligned with backend URL.
- Ensure MongoDB is running and accessible before starting backend.
