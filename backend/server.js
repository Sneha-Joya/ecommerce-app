require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// =====================================================
// CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET || "ecommerce_secret_key";

// =====================================================
// MIDDLEWARE
// =====================================================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    console.log("DATABASE:", mongoose.connection.name);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// =====================================================
// USER SCHEMA
// =====================================================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

// =====================================================
// PRODUCT SCHEMA
// =====================================================

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

// =====================================================
// ORDER SCHEMA
// =====================================================

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    paymentMethod: {
      type: String,
      default: "cod",
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid authorization format",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// =====================================================
// ADMIN MIDDLEWARE
// =====================================================

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.send("E-Commerce API is running...");
});

// =====================================================
// REGISTER USER
// =====================================================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });
    console.log("LOGIN USER:", user?.email, user?.role);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

// =====================================================
// GET ALL PRODUCTS
// =====================================================

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products error:", error);

    res.status(500).json({
      message: "Error fetching products",
    });
  }
});

// =====================================================
// ADD PRODUCT
// =====================================================

app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Product name and price are required",
      });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      description: description || "",
      image: image || "",
      category: category || "General",
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      message: "Error adding product",
    });
  }
});

// =====================================================
// DELETE PRODUCT - ADMIN ONLY
// =====================================================

app.delete(
  "/api/products/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.status(200).json({
        message: "Product deleted successfully",
        product,
      });
    } catch (error) {
      console.error("Delete product error:", error);

      res.status(500).json({
        message: "Error deleting product",
      });
    }
  }
);

// =====================================================
// CREATE ORDER
// =====================================================

app.post("/api/orders", async (req, res) => {
  try {
    const {
      customer,
      items,
      paymentMethod,
      total,
    } = req.body;

    if (!customer) {
      return res.status(400).json({
        message: "Customer information is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    if (total === undefined) {
      return res.status(400).json({
        message: "Order total is required",
      });
    }

    const order = await Order.create({
      customer,
      items,
      paymentMethod: paymentMethod || "cod",
      total: Number(total),
      status: "Pending",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Error placing order",
      error: error.message,
    });
  }
});

// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

app.get(
  "/api/orders",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find().sort({
        createdAt: -1,
      });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Fetch orders error:", error);

      res.status(500).json({
        message: "Error fetching orders",
      });
    }
  }
);

// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================

app.put(
  "/api/orders/:id/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const updatedOrder =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
          }
        );

      if (!updatedOrder) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.status(200).json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      res.status(500).json({
        message: "Error updating order status",
      });
    }
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});