# E-Commerce Store

A full-stack e-commerce web application built with React, Node.js, Express.js, and MongoDB. The application allows users to browse products, add products to a cart, place orders, and provides an admin section for managing products and orders.

## Features

### User Features

* User registration and login
* User authentication
* Browse available products
* Search products
* Filter products by category
* Add products to cart
* View cart items and quantity
* Place orders
* View order information

### Admin Features

* Admin authentication
* Add new products
* Delete products
* View customer orders
* View customer and product details
* Update order status

## Technologies Used

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* dotenv

## Project Structure

```text
ecommerce-app/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── index.html
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sneha-Joya/ecommerce-app.git
cd ecommerce-app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Do not upload the `.env` file to GitHub.

### 4. Start the Backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API

Products API:

```text
GET http://localhost:5000/api/products
```

The API provides product data from the MongoDB database.

## Database

MongoDB is used to store:

* Users
* Products
* Orders

The backend connects to MongoDB using Mongoose.

## Authentication

JWT-based authentication is used to protect authenticated functionality and distinguish between regular users and administrators.

## Future Improvements

* Online payment integration
* Product image upload
* User order history
* Product reviews and ratings
* Wishlist functionality
* Responsive mobile UI improvements
* Deployment with production environment variables

## Author

**Sneha Joya**

GitHub: https://github.com/Sneha-Joya

LinkedIn: https://www.linkedin.com/in/sneha-joya
