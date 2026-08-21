import { useEffect, useState } from "react";
import "./style.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [newProduct, setNewProduct] = useState({
  name: "",
  price: "",
  description: "",
  image: "",
});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  // Authentication
const [isLogin, setIsLogin] = useState(true);
const [user, setUser] = useState(null);

const [authForm, setAuthForm] = useState({
  name: "",
  email: "",
  password: "",
});

const handleAuthChange = (e) => {
  setAuthForm({
    ...authForm,
    [e.target.name]: e.target.value,
  });
};
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  setUser(null);
  setIsLogin(false);

  alert("Logged out successfully");
};

const handleAuthSubmit = async (e) => {
  e.preventDefault();

  const url = isLogin
    ? "https://ecommerce-app-a7dx.onrender.com/api/login"
    : "https://ecommerce-app-a7dx.onrender.com/api/register";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authForm),
    });

    const data = await response.json();

    if (response.ok) {
  alert(data.message);

  // Save JWT token after login
  if (isLogin && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
  }

  setUser(data.user);

  setAuthForm({
    name: "",
    email: "",
    password: "",
  });
}
    else {
      alert(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    alert("Cannot connect to server");
  }
};
  const [orders, setOrders] = useState([]);
const [showOrders, setShowOrders] = useState(false);

// Fetch all orders
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("https://ecommerce-app-a7dx.onrender.com/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    setOrders(data);
setShowOrders(true);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};
  const [customer, setCustomer] = useState({
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
});
  const [showCheckout, setShowCheckout] = useState(false);

const [paymentMethod, setPaymentMethod] = useState("cod");
const [orderMessage, setOrderMessage] = useState("");

  // Fetch products
  useEffect(() => {
    fetch("https://ecommerce-app-a7dx.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Add to cart
  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Delete product
const deleteProduct = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `https://ecommerce-app-a7dx.onrender.com/api/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete product");
    }

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== id)
    );

    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Delete product error:", error);
    alert(error.message || "Failed to delete product");
  }
};


// 👇 ADD THIS HERE
const addProduct = async () => {
  if (!newProduct.name || !newProduct.price) {
    alert("Please enter product name and price");
    return;
  }

  try {
    const response = await fetch(
      "https://ecommerce-app-a7dx.onrender.com/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: Number(newProduct.price),
          description: newProduct.description,
          image: newProduct.image,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add product");
    }

    setProducts((prevProducts) => [
      ...prevProducts,
      data,
    ]);

    setNewProduct({
      name: "",
      price: "",
      description: "",
      image: "",
    });

    alert("Product added successfully!");
  } catch (error) {
    console.error("Add product error:", error);
    alert(error.message || "Failed to add product");
  }
};

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Place order
const placeOrder = async () => {
  if (
    !customer.name ||
    !customer.email ||
    !customer.phone ||
    !customer.address ||
    !customer.city ||
    !customer.pincode
  ) {
    alert("Please fill in all customer details.");
    return;
  }

  try {
    const orderData = {
      customer,
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      paymentMethod,
      total,
    };

    const response = await fetch(
      "https://ecommerce-app-a7dx.onrender.com/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to place order");
    }

    setOrderMessage("✅ Order placed successfully!");

    setCart([]);
    setShowCheckout(false);

    setCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });

  } catch (error) {
    console.error("Order error:", error);
    alert("Failed to place order. Please try again.");
  }
};
  // Categories
  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // Search + category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Cart count
  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Total
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  

  return (
    <div className="app">
      {/* Login / Register */}
{!user && (
  <section className="auth-section">
    <h2>{isLogin ? "🔐 Login" : "📝 Create Account"}</h2>

    <form onSubmit={handleAuthSubmit}>

      {!isLogin && (
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={authForm.name}
          onChange={handleAuthChange}
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={authForm.email}
        onChange={handleAuthChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={authForm.password}
        onChange={handleAuthChange}
        required
      />

      <button type="submit">
        {isLogin ? "Login" : "Register"}
      </button>

    </form>

    <p>
      {isLogin
        ? "Don't have an account?"
        : "Already have an account?"}

      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? " Register" : " Login"}
      </button>
    </p>
  </section>
)}

      {/* Navbar */}
      <header className="navbar">
        <h1>🛍️ E-Commerce Store</h1>

      {localStorage.getItem("role") === "admin" && (
  <button onClick={fetchOrders}>
    📦 Admin Orders
  </button>
)}
{isLogin && (
  <button onClick={handleLogout}>
    🚪 Logout
  </button>
)}
        <div className="cart">
          🛒 Cart: <strong>{cartCount}</strong>
        </div>
      </header>

      <main>

        {showOrders && (
  <section className="admin-orders">
    <h2>📦 Admin Orders</h2>

    {orders.length === 0 ? (
      <p>No orders found.</p>
    ) : (
      orders.map((order) => (
        <div className="order-card" key={order._id}>

          <div className="order-header">
            <strong>Order ID: {order._id}</strong>
            <span>
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <h3>Customer Details</h3>

          <p>
            <strong>Name:</strong>{" "}
            {order.customer?.name || "N/A"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {order.customer?.email || "N/A"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {order.customer?.phone || "N/A"}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {order.customer?.address || "N/A"}
          </p>

          <p>
            <strong>City:</strong>{" "}
            {order.customer?.city || "N/A"}
          </p>

          <p>
            <strong>Pincode:</strong>{" "}
            {order.customer?.pincode || "N/A"}
          </p>

          <h3>Products</h3>

          {order.items?.map((item, index) => (
            <div className="order-product" key={index}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ₹{Number(item.price) * item.quantity}
              </span>
            </div>
          ))}

          <div className="order-footer">

  <div>
    <strong>
      Payment: {order.paymentMethod}
    </strong>

    <br />

    <strong>
      Total: ₹{order.total}
    </strong>
  </div>

  <div className="status-section">

    <label>
      Order Status:
    </label>

    <select
      value={order.status || "Pending"}
      onChange={async (e) => {
        const newStatus = e.target.value;

        try {
          const response = await fetch(
            `https://ecommerce-app-a7dx.onrender.com/api/orders/${order._id}/status`,
            {
              method: "PUT",
              headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
              body: JSON.stringify({
                status: newStatus,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to update status"
            );
          }

          setOrders(
            orders.map((item) =>
              item._id === order._id
                ? {
                    ...item,
                    status: newStatus,
                  }
                : item
            )
          );

        } catch (error) {
          console.error(
            "Status update error:",
            error
          );

          alert("Failed to update order status.");
        }
      }}
    >

      <option value="Pending">
        Pending
      </option>

      <option value="Confirmed">
        Confirmed
      </option>

      <option value="Shipped">
        Shipped
      </option>

      <option value="Delivered">
        Delivered
      </option>

    </select>

  </div>

</div>

        </div>
      ))
    )}
  </section>
)}

        {/* Search */}
        <div className="search-section">

          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Categories */}
        <div className="categories">

          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "category active"
                  : "category"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}

        </div>

        {/* Products */}
        <h2>Our Products</h2>

        {filteredProducts.length === 0 ? (
          <p className="no-products">
            No products found.
          </p>
        ) : (
          <div className="product-grid">

            {localStorage.getItem("role") === "admin" && (
  <section className="add-product-section">
    <h2>➕ Add Product</h2>

    <input
      type="text"
      placeholder="Product Name"
      value={newProduct.name}
      onChange={(e) =>
        setNewProduct({ ...newProduct, name: e.target.value })
      }
    />

    <input
      type="number"
      placeholder="Price"
      value={newProduct.price}
      onChange={(e) =>
        setNewProduct({ ...newProduct, price: e.target.value })
      }
    />

    <input
      type="text"
      placeholder="Image URL"
      value={newProduct.image}
      onChange={(e) =>
        setNewProduct({ ...newProduct, image: e.target.value })
      }
    />

    <textarea
      placeholder="Product Description"
      value={newProduct.description}
      onChange={(e) =>
        setNewProduct({
          ...newProduct,
          description: e.target.value,
        })
      }
    />

    <button onClick={addProduct}>
      Add Product
    </button>
  </section>
)}

            {filteredProducts.map((product) => (
              <div
                className="product-card"
                key={product._id}
              >

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                )}

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <p className="price">
                  ₹{product.price}
                </p>

                <button
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                {localStorage.getItem("role") === "admin" && (
                  <button onClick={() => deleteProduct(product._id)}>
                    Delete Product
                </button>
                )}

              </div>
            ))}

          </div>
        )}

        {/* Cart */}
        {cart.length > 0 && (
          <section className="cart-section">

            <h2>🛒 Your Cart</h2>

            {cart.map((item) => (
              <div
                className="cart-item"
                key={item._id}
              >

                <div>
                  <strong>{item.name}</strong>
                  <p>₹{item.price} each</p>
                </div>

                <div className="quantity">

                  <button
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                  >
                    +
                  </button>

                </div>

                <strong>
                  ₹
                  {Number(item.price) *
                    item.quantity}
                </strong>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  🗑️
                </button>

              </div>
            ))}

            <div className="cart-total">

              <h3>
                Total: ₹{total}
              </h3>

              <button
  className="checkout-btn"
  onClick={() => setShowCheckout(true)}
>
  Proceed to Checkout
</button>

            </div>

          </section>
        )}

               {/* Checkout */}

               {orderMessage && (
  <div className="order-success">
    {orderMessage}
  </div>
)}
{showCheckout && (
  <section className="checkout-section">

    <h2>🛍️ Checkout</h2>

    <div className="checkout-container">

      {/* Customer Details */}
      <div className="checkout-form">

        <h3>Customer Details</h3>

        <input
  type="text"
  placeholder="Full Name"
  value={customer.name}
  onChange={(e) =>
    setCustomer({
      ...customer,
      name: e.target.value,
    })
  }
/>

        <input
  type="email"
  placeholder="Email Address"
  value={customer.email}
  onChange={(e) =>
    setCustomer({
      ...customer,
      email: e.target.value,
    })
  }
/>

        <input
  type="tel"
  placeholder="Phone Number"
  value={customer.phone}
  onChange={(e) =>
    setCustomer({
      ...customer,
      phone: e.target.value,
    })
  }
/>

        <textarea
  placeholder="Full Address"
  rows="4"
  value={customer.address}
  onChange={(e) =>
    setCustomer({
      ...customer,
      address: e.target.value,
    })
  }
></textarea>

        <div className="checkout-row">

          <input
  type="text"
  placeholder="City"
  value={customer.city}
  onChange={(e) =>
    setCustomer({
      ...customer,
      city: e.target.value,
    })
  }
/>

      <input
  type="text"
  placeholder="Pincode"
  value={customer.pincode}
  onChange={(e) =>
    setCustomer({
      ...customer,
      pincode: e.target.value,
    })
  }
/>

        </div>

        <h3>Payment Method</h3>

        <div className="payment-methods">

          <label>
            <input
  type="radio"
  name="payment"
  value="cod"
  checked={paymentMethod === "cod"}
  onChange={(e) => setPaymentMethod(e.target.value)}
/>
            Cash on Delivery
          </label>

          <label>
            <input
  type="radio"
  name="payment"
  value="online"
  checked={paymentMethod === "online"}
  onChange={(e) => setPaymentMethod(e.target.value)}
/>
            Online Payment
          </label>

        </div>

      </div>

      {/* Order Summary */}
      <div className="order-summary">

        <h3>Order Summary</h3>

        {cart.map((item) => (
          <div
            className="summary-item"
            key={item._id}
          >

            <span>
              {item.name} × {item.quantity}
            </span>

            <strong>
              ₹{Number(item.price) * item.quantity}
            </strong>

          </div>
        ))}

        <hr />

        <div className="summary-total">

          <strong>Total</strong>

          <strong>
            ₹{total}
          </strong>

        </div>

        <div className="checkout-form">
  <h2>📦 Checkout Details</h2>

  <input
    type="text"
    placeholder="Full Name"
    value={customer.name}
    onChange={(e) =>
      setCustomer({ ...customer, name: e.target.value })
    }
  />

  <input
    type="email"
    placeholder="Email Address"
    value={customer.email}
    onChange={(e) =>
      setCustomer({ ...customer, email: e.target.value })
    }
  />

  <input
    type="tel"
    placeholder="Phone Number"
    value={customer.phone}
    onChange={(e) =>
      setCustomer({ ...customer, phone: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Address"
    value={customer.address}
    onChange={(e) =>
      setCustomer({ ...customer, address: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="City"
    value={customer.city}
    onChange={(e) =>
      setCustomer({ ...customer, city: e.target.value })
    }
  />

  <input
    type="text"
    placeholder="Pincode"
    value={customer.pincode}
    onChange={(e) =>
      setCustomer({ ...customer, pincode: e.target.value })
    }
  />
</div>

        <button
  className="place-order-btn"
  onClick={placeOrder}
>
  Place Order
</button>

        <button
          className="back-cart-btn"
          onClick={() => setShowCheckout(false)}
        >
          ← Back to Cart
        </button>

      </div>

    </div>

  </section>
)} 

      </main>
    </div>
  );
}

export default App;