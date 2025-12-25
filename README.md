# Tuhfina Creation - Luxury E-Commerce Platform

A production-ready, luxury e-commerce website for handcrafted gifts built with Next.js 14, Firebase, and Tailwind CSS.

## 🌟 Features

### Customer Features
- **Product Browsing**: Browse products by 7 different categories
- **Product Search & Filter**: Filter products by category
- **Product Details**: View detailed product information with image galleries
- **Product Customization**: Add custom text and images to customizable products
- **Shopping Cart**: Add/remove items, update quantities with localStorage persistence
- **Checkout**: Complete checkout flow with shipping information
- **User Dashboard**: View order history and profile information
- **Authentication**: Secure email/password authentication via Firebase

### Admin Features (Admin Email: Tuhfinacreations@gmail.com)
- **Product Management**: Full CRUD operations for products
- **Image Upload**: Upload multiple product images to Firebase Storage
- **Order Management**: View all orders and update order status
- **Dashboard Analytics**: View total products, orders, and pending orders
- **Category Management**: Organize products by category
- **Customization Toggle**: Enable/disable customization per product

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom luxury design system
- **Backend**: Firebase Authentication, Firestore Database, Firebase Storage
- **State Management**: React Context API (Auth + Cart)
- **Icons**: Lucide React
- **Animations**: Framer Motion, Custom CSS animations

## 📁 Project Structure

```
Tufina_Creation/
├── app/
│   ├── admin/              # Admin dashboard
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
│   │   ├── orderService.ts     # Order CRUD operations
│   │   └── productService.ts   # Product CRUD operations
│   ├── firebase.ts         # Firebase configuration
│   └── types.ts            # TypeScript interfaces
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account with a project set up

### Installation

1. **Clone the repository**
   ```bash
   cd Tufina_Creation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The `.env.local` file is already configured with Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAFXvC4D_Fl1cae-EaQnfkOXFSrI7ypmPo
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tufina-creation.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tufina-creation
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tufina-creation.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=425393800548
   NEXT_PUBLIC_FIREBASE_APP_ID=1:425393800548:web:2db3a366d0a41802e4e671
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
- Full product and order management access

### User Access
- Any other email address
- Automatically redirected to `/dashboard`
- Can browse products, place orders, view order history

## 🎨 Design System

### Colors
- **Luxury Gold**: #D4AF37
- **Dark Gold**: #B8941E
- **Cream**: #FFF8F0
- **Black**: #1A1A1A
- **Gray**: #4A4A4A

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)

### Key Features
- Clean white background
- Smooth hover animations
- Responsive design (mobile-first)
- Premium feel with elegant spacing

## 📦 Product Categories

1. Artificial Flower Bouquets
2. Real Flower Bouquets
3. Gifts
4. Customized Earrings
5. Customized Frames
6. Customized Keychains
7. Diwali Diyas & Candles

## 🔥 Firebase Setup

### Firestore Collections

**users**
```javascript
{
  uid: string,
  email: string,
  role: "ADMIN" | "USER",
  createdAt: timestamp
}
```

**products**
```javascript
{
  id: string,
  title: string,
  description: string,
  price: number,
  category: string,
  images: string[],
  isCustomizable: boolean,
  createdAt: timestamp
}
```

**orders**
```javascript
{
  id: string,
  userId: string,
  userEmail: string,
  items: [{
    productId: string,
    title: string,
    price: number,
    quantity: number,
    imageUrl: string,
    customization?: {
      text?: string,
      imageUrl?: string
    }
  }],
  totalAmount: number,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  shippingAddress: {
    name: string,
    address: string,
    city: string,
    state: string,
    pincode: string,
    phone: string
  },
  createdAt: timestamp
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN";
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                    (resource.data.userId == request.auth.uid || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN");
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "ADMIN";
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /customizations/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page | Public |
| `/shop` | Product listing | Public |
| `/product/[id]` | Product details | Public |
| `/cart` | Shopping cart | Public |
| `/login` | Login page | Public |
| `/register` | Registration | Public |
| `/checkout` | Checkout | Authenticated |
| `/dashboard` | User dashboard | Users only |
| `/admin` | Admin dashboard | Admin only |

## 🎯 Key Functionalities

### Product Customization
- Users can add custom text to products
- Users can upload custom images
- Images stored in Firebase Storage
- Customization details saved with order

### Order Flow
1. Browse products
2. Add to cart (with optional customization)
3. Review cart
4. Login/Register (if not authenticated)
5. Enter shipping details
6. Place order
7. View order in dashboard

### Admin Workflow
1. Login with admin email
2. Access admin dashboard
3. Add/Edit/Delete products
4. Upload product images
5. View all orders
6. Update order status

## 🔧 Troubleshooting

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase console for project status
- Ensure Firestore and Storage are enabled

## 📄 License

This project is proprietary and confidential.

## 👤 Contact

**Tuhfina Creation**
- Email: neerajkumar75260@gmail.com

---

Built with ❤️ using Next.js 14 and Firebase
