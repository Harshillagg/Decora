# Decora - Premium Home Decor E-commerce Platform

Decora is a full-stack e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. It offers a seamless shopping experience for premium home decor products with features like product browsing, wishlist management, cart functionality, user authentication, and more.

## 🚀 Features

### User Features
- **User Authentication** - Register, login, and profile management
- **Product Browsing** - Browse products with advanced filtering and search
- **Wishlist Management** - Save favorite products for later
- **Shopping Cart** - Add, update, and remove products from cart
- **Responsive Design** - Optimized for all devices
- **Dark/Light Mode** - Toggle between dark and light themes

### Technical Features
- **TypeScript** - Type-safe code throughout the application
- **Redux State Management** - Centralized state with Redux Toolkit
- **JWT Authentication** - Secure user authentication
- **RESTful API** - Well-structured backend API
- **MongoDB Database** - NoSQL database for flexible data storage
- **Responsive UI** - Built with Tailwind CSS
- **Toast Notifications** - User-friendly notifications

## 📋 Tech Stack

### Frontend
- React
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Lucide React (icons)
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/Harshillagg/Decora.git
   cd decora
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env` file in the server directory with the following variables:
   \`\`\`
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   TOKEN_SECRET=your_jwt_secret_key
   CORS_ORIGIN=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   \`\`\`

4. **Run the application**
   \`\`\`bash
   # Run the server (from server directory)
   npm run dev

   # Run the client (from client directory)
   npm run dev
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000


## 📱 Usage

### User Authentication
1. Register a new account or login with existing credentials
2. User session is maintained with JWT tokens

### Browsing Products
1. Visit the Products page to browse all available products
2. Use filters to narrow down products by category, price, color, etc.
3. Use the search bar to find specific products
4. Toggle between grid and list views

### Managing Wishlist
1. Click the heart icon on any product to add it to your wishlist
2. Visit the Wishlist page to view all saved items
3. Add items from wishlist to cart or remove them

### Shopping Cart
1. Add products to your cart from product pages or wishlist
2. Adjust quantities or remove items in the cart page
3. Proceed to checkout (implementation in progress)

