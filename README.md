# 🏠 PG Finder - Complete PG Listing Platform

A full-stack PG (Paying Guest) listing platform that connects students with PG owners. Built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### For Students
- **Browse & Search**: Find PGs by location, college, or keywords
- **Advanced Filtering**: Filter by gender, facilities, price range, and more
- **Detailed Listings**: View photos, facilities, ratings, and reviews
- **Booking System**: Book PGs directly through the platform
- **Visit Requests**: Request property visits
- **Reviews & Ratings**: Rate and review PGs
- **Favorites**: Save favorite listings
- **Responsive Design**: Works seamlessly on desktop and mobile

### For PG Owners
- **Owner Dashboard**: Comprehensive dashboard with KPIs and analytics
- **Listing Management**: Create, edit, and manage PG listings
- **Image Upload**: Upload up to 5 images per listing with Cloudinary integration
- **Booking Management**: View and manage bookings
- **Inquiry Management**: Handle visit requests and inquiries
- **Review System**: Respond to student reviews

### General Features
- **Authentication**: Secure JWT-based authentication with refresh tokens
- **Role-based Access**: Separate interfaces for students and owners
- **Real-time Notifications**: Toast notifications for all actions
- **Image Gallery**: Beautiful image galleries with zoom effects
- **Responsive Sidebar**: Animated sidebar with filters
- **Search Integration**: Global search functionality
- **WhatsApp Integration**: Direct WhatsApp contact for owners

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Hot Toast** - Notification system
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Joi** - Schema validation
- **Multer** - File upload handling
- **Cloudinary** - Image storage and management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project_5
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pg-finder
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Start the development servers**
   
   Terminal 1 (Server):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Client):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
project_5/
├── client/                 # React frontend
│   ├── src/
│   │   ├── app/           # Redux store configuration
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Redux slices (auth, listings, etc.)
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route protection components
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Utility functions (API client, JWT)
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Database and Cloudinary configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middlewares/   # Custom middleware (auth, validation, error)
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🔐 Authentication

The application uses JWT-based authentication with the following features:
- **Access Tokens**: Short-lived tokens for API requests
- **Refresh Tokens**: Long-lived tokens stored in HTTP-only cookies
- **Automatic Refresh**: Seamless token refresh on expiration
- **Role-based Access**: Separate permissions for students and owners

## 📱 Key Pages & Features

### Student Interface
- **Home**: Browse and filter PG listings
- **PG Details**: View detailed listing information
- **Book PG**: Booking form with validation
- **Request Visit**: Visit request form
- **My Bookings**: View booking history
- **My Inquiries**: Track visit requests
- **Favorites**: Saved listings

### Owner Interface
- **Owner Dashboard**: Analytics and quick actions
- **My Listings**: Manage all listings
- **Add Listing**: Create new PG listings
- **Edit Listing**: Update existing listings
- **Bookings**: View and manage bookings
- **Inquiries**: Handle visit requests

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Sticky Navigation**: Always-accessible navigation bar
- **Animated Sidebar**: Smooth slide-in/out animations
- **Image Galleries**: Professional image display with zoom effects
- **Loading States**: User feedback during API calls
- **Toast Notifications**: Real-time feedback for all actions
- **Form Validation**: Client and server-side validation
- **Password Visibility**: Toggle password visibility in forms

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (owner only)
- `PUT /api/listings/:id` - Update listing (owner only)
- `DELETE /api/listings/:id` - Delete listing (owner only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/listing/:id` - Get listing reviews

### Inquiries
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries` - Get user inquiries

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables for `VITE_API_URL`

### Backend (Railway/Heroku)
1. Set up MongoDB Atlas
2. Configure Cloudinary
3. Set all environment variables
4. Deploy to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database
- Cloudinary for image management
- All open-source contributors

---

**Happy Coding! 🚀**