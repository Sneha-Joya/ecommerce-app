# 🛒 E-Commerce Web Application

A full-stack **E-Commerce Web Application** built using **React.js, Node.js, Express.js, and MongoDB**. The application provides user authentication, product browsing, shopping cart functionality, and order placement.

## 🚀 Features

### 👤 User Features

* User registration and login
* Secure password hashing using bcrypt
* User authentication
* Browse available products
* Search products
* Filter products by category
* Add products to cart
* Update cart quantities
* Remove products from cart
* Checkout and place orders
* Enter customer and delivery details

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Role-based user information
* Passwords stored securely using hashing

### 🛍️ Product Features

* Display products from MongoDB
* Product search
* Category filtering
* Product pricing
* Shopping cart management

### 📦 Order Features

* Customer information
* Delivery address
* City and PIN code
* Payment method selection
* Order creation and storage

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* MongoDB Atlas

### Authentication & Security

* JWT
* bcrypt

### Development Tools

* Git
* GitHub
* VS Code
* npm

## 📁 Project Structure

```text
ecommerce-app/
│
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── .env
│
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sneha-Joya/ecommerce-app.git
cd ecommerce-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

> **Important:** Never upload your `.env` file or MongoDB password to GitHub.

### 3. Start the Backend

```bash
npm start
```

The backend will run locally on:

```text
http://localhost:5000
```

### 4. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will then display the local development URL provided by Vite.

## 🔑 Authentication Flow

The application provides:

1. **Register** – Create a new user account.
2. **Login** – Authenticate using email and password.
3. **JWT Authentication** – A token is generated after successful login.
4. **Role Information** – User information includes the assigned role.
5. **Protected Functionality** – Authenticated users can access application features according to their role.

## 🔌 API Endpoints

### Authentication

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| POST   | `/api/register` | Register a new user    |
| POST   | `/api/login`    | Login an existing user |

### Orders

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| POST   | `/api/orders` | Create/place an order |

> Additional endpoints may be available depending on the backend implementation.

## 🗄️ Database

The application uses **MongoDB Atlas** for storing application data.

The database connection is configured through the `MONGO_URI` environment variable.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

Do not use the example credentials above. Use your own MongoDB Atlas connection string.

## 🔒 Security

* Passwords are hashed using **bcrypt** before being stored.
* JWT is used for authentication.
* Database credentials are stored in environment variables.
* Sensitive `.env` files should not be committed to GitHub.

## 🌐 Deployment

The project is structured so that the backend and frontend can be deployed separately.

### Backend

The backend can be deployed using services such as:

* Render
* Railway
* Other Node.js hosting platforms

### Frontend

The React frontend can be deployed using:

* Netlify
* Vercel
* Other React-compatible hosting platforms

## 🎯 Project Objective

The objective of this project is to develop a practical full-stack E-Commerce application demonstrating:

* Frontend development
* Backend API development
* Database integration
* User authentication
* Secure password handling
* Shopping cart functionality
* Order management
* REST API communication
* Full-stack application architecture

## 👩‍💻 Developer

**Sneha Joya**

* GitHub: https://github.com/Sneha-Joya
* LinkedIn: https://www.linkedin.com/in/sneha-joya

## 📌 Future Improvements

* Online payment gateway integration
* Product reviews and ratings
* Wishlist functionality
* Admin dashboard
* Product management
* Order tracking
* Image upload functionality
* Improved authorization and protected admin routes
* Production deployment

## ⭐ Acknowledgement

This project was developed as a full-stack web development project to gain practical experience in **React.js, Node.js, Express.js, MongoDB, authentication, and REST API development**.
