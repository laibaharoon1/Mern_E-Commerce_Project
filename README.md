# MERN E-Commerce Platform

A full-stack e-commerce web application built with the MERN stack. The project includes a customer-facing shopping experience, secure authentication, product browsing, cart and checkout flows, address management, order handling, product reviews, and an admin dashboard for managing inventory and orders.

## Tech Stack

### Frontend

- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- shadcn-style reusable UI components

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication with cookies
- Cloudinary image upload support
- PayPal integration support

## Features

- User registration and login
- Role-based customer/admin access
- Product listing and detail pages
- Product search and filtering
- Shopping cart functionality
- Checkout and address management
- Order creation and order tracking
- Customer product reviews
- Admin product management
- Admin order management
- Cloudinary-powered product image upload

## Project Structure

```text
client/          Frontend React/Vite application
server/          Express.js and MongoDB backend API
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB instance
- Cloudinary account
- PayPal credentials if using live payment flows

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with variables such as:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173
```

Run the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Run the React app:

```bash
npm run dev
```

## API Overview

The backend exposes REST APIs under the `/api` namespace, including:

- `/api/auth`
- `/api/admin/products`
- `/api/admin/order`
- `/api/shop/products`
- `/api/shop/cart`
- `/api/shop/address`
- `/api/shop/order`
- `/api/shop/search`
- `/api/shop/review`
- `/api/common/feature`

## Routes

The frontend is implemented as a Vite React app with pages for:

- Login and registration
- Customer shopping experience
- Product details and checkout
- Admin dashboard and product management
- Account and order pages

## License

This project is licensed under the ISC License.

## Author

Laiba Beyg
