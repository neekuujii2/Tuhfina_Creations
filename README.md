# Tuhfina Creation - Luxury E-Commerce Platform

A production-ready, luxury e-commerce website for handcrafted gifts built with Next.js 14, MongoDB Atlas, Cloudinary, and Razorpay.

## 🌟 Features

### Customer Features
- **Product Browsing**: Browse products by categories dynamically fetched from MongoDB
- **Product Search & Filter**: Filter products by category
- **Product Details**: View detailed product information with image galleries from Cloudinary
- **Product Customization**: Add custom text and images to customizable products
- **Shopping Cart**: Add/remove items, update quantities with localStorage persistence
- **Checkout**: Secure checkout flow integrated with Razorpay payment gateway
- **Our Story**: Learn about the brand's values and craftsmanship
- **User Dashboard**: View order history, download invoices, and manage profile
- **Authentication**: Secure email/password authentication via Firebase

### Admin Features (Admin Email: Tuhfinacreations@gmail.com)
- **Product Management**: Full CRUD operations for products (MongoDB Atlas)
- **Image Upload**: Seamless image uploads to Cloudinary
- **Category Management**: Dynamically manage category images and descriptions
- **Order Management**: Track all orders, update status, and manage payments
- **Bulk Import**: Import products in bulk via CSV upload
- **Dashboard Analytics**: Real-time stats for products and orders

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom luxury design system
- **Database**: MongoDB Atlas (Products, Orders, Categories) & Firebase Firestore (User Profiles)
- **Image Storage**: Cloudinary (Product & Category images)
- **Payments**: Razorpay Gateway
- **Authentication**: Firebase Authentication
- **Icons**: Lucide React
- **Animations**: Framer Motion

## � Docker

### Build the image
```bash
docker build -t tuhfina-creation .
```

### Run the container
```bash
docker run -p 3000:3000 --env-file .env.local tuhfina-creation
```

## �📁 Project Structure

```
Tuhfina_Creations/
├── app/
│   ├── about/              # Brand story page
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes (MongoDB, Cloudinary, Razorpay)
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout page
│   ├── dashboard/          # User dashboard
│   ├── login/              # Login page
│   ├── product/[id]/       # Product detail page
│   ├── register/           # Registration page
│   ├── shop/               # Product listing page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── Footer.tsx          # Footer component
│   └── Navbar.tsx          # Navigation component
├── contexts/
│   ├── AuthContext.tsx     # Authentication context
│   └── CartContext.tsx     # Shopping cart context
├── lib/
│   ├── services/
│   │   ├── orderService.ts     # Order operations
│   │   └── productService.ts   # Product & Cloudinary operations
│   ├── firebase.ts         # Firebase configuration
│   ├── mongodb.ts          # MongoDB connection
│   └── types.ts            # TypeScript interfaces
├── models/                 # Mongoose models
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas cluster
- Cloudinary account
- Razorpay account (Test mode enabled)
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tuhfina_Creations
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory and add the following:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # MongoDB
   DATABASE_URL=your_mongodb_connection_string

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret

   # Admin
   NEXT_PUBLIC_ADMIN_EMAIL=Tuhfinacreations@gmail.com
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   
   Navigate to `http://localhost:3000`

## 🔐 Authentication & Roles

### Admin Access
- **Email**: Tuhfinacreations@gmail.com
- **Password**: (Set during first registration)
- Automatically redirected to `/admin` dashboard
- Full control over catalog and orders

### User Access
- Any other registered email
- Access to order history and profile
- Ability to place orders and customize products

## 🎨 Design System

### Colors
- **Luxury Gold**: #D4AF37
- **Cream**: #FFF8F0
- **Black**: #1A1A1A
- **Gray**: #4A4A4A

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables listed in `.env.local` section
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

## 📄 License

This project is proprietary and confidential.

## 👤 Contact

**Tuhfina Creation**
- Email: neerajkumar75260@gmail.com

---

Built with ❤️ using Next.js 14 and Modern Web Technologies
