# E-Commerce Application

A full-stack, responsive e-commerce application with comprehensive features for both customers and administrators.

## Features

### Customer Features
- ✅ User authentication (Login/Register/Logout/Forgot Password)
- ✅ Browse products by categories, featured, and latest
- ✅ Product detail pages with reviews and ratings
- ✅ Add products to cart and wishlist
- ✅ Checkout with address selection (COD payment)
- ✅ Order tracking with status updates
- ✅ User profile management with addresses
- ✅ Real-time notifications

### Admin Features
- ✅ Admin dashboard with sales analytics
- ✅ Category management (CRUD)
- ✅ Product management (CRUD)
- ✅ Order management with status updates
- ✅ Sales analytics (day/week/month/year)

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Morgan for logging
- Dotenv for environment variables

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- CSS for styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5002`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Creating an Admin Account
1. Register a new account
2. Select "Admin" as the account type during registration

### Creating a Customer Account
1. Register a new account
2. Select "Customer" as the account type (default)

### Testing the Application

1. **Customer Flow:**
   - Browse products on the home page
   - Click on a product to view details
   - Add products to cart or wishlist
   - Go to cart and proceed to checkout
   - Select or add a shipping address
   - Place order with COD payment
   - Track order status in "My Orders"

2. **Admin Flow:**
   - Login with admin credentials
   - Access admin dashboard to view analytics
   - Manage categories (create, edit, delete)
   - Manage products (create, edit, delete)
   - Update order statuses
   - View sales analytics by different time periods

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- POST `/api/auth/forgot-password` - Forgot password

### Products
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)
- POST `/api/products/:id/review` - Add review

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category (Admin)
- PUT `/api/categories/:id` - Update category (Admin)
- DELETE `/api/categories/:id` - Delete category (Admin)

### Cart
- GET `/api/cart` - Get user cart
- POST `/api/cart` - Add to cart
- PUT `/api/cart/:itemId` - Update cart item
- DELETE `/api/cart/:itemId` - Remove from cart

### Wishlist
- GET `/api/wishlist` - Get user wishlist
- POST `/api/wishlist` - Add to wishlist
- DELETE `/api/wishlist/:productId` - Remove from wishlist

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- GET `/api/orders/admin/all` - Get all orders (Admin)
- PUT `/api/orders/:id/status` - Update order status (Admin)

### Notifications
- GET `/api/notifications` - Get user notifications
- PUT `/api/notifications/:id/read` - Mark as read

### Analytics (Admin)
- GET `/api/analytics/sales` - Get sales analytics
- GET `/api/analytics/dashboard` - Get dashboard stats

## Project Structure

```
latest ecomm/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   └── admin/
    │   ├── store/
    │   │   └── slices/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Features Implementation

- ✅ Role-based access control (Admin/Customer)
- ✅ JWT authentication with secure password hashing
- ✅ Product catalog with categories
- ✅ Shopping cart and wishlist
- ✅ Order management with status tracking
- ✅ Real-time notifications
- ✅ Sales analytics dashboard
- ✅ Responsive design for all devices
- ✅ Interactive UI with smooth animations

## License

MIT

## Author

E-Commerce Team
