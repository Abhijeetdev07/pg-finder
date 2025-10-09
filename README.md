# 🏠 PG Finder

A full-stack PG listing platform connecting students with PG owners.

## 🚀 Features

- **Browse & Search** PGs by location, college, or keywords
- **Advanced Filtering** by gender, facilities, price range
- **Booking System** for students to book PGs
- **Owner Dashboard** for managing listings and bookings
- **Review System** with ratings and comments
- **Image Upload** with Cloudinary integration
- **Responsive Design** for all devices

## 🛠 Tech Stack

**Frontend:** React, Redux Toolkit, Tailwind CSS, React Router  
**Backend:** Node.js, Express, MongoDB, JWT Authentication  
**Storage:** Cloudinary for images

## 📁 Project Structure

```
project_5/
├── client/                 # React frontend
│   ├── src/
│   │   ├── app/           # Redux store
│   │   ├── components/    # UI components
│   │   ├── features/      # Redux slices
│   │   ├── pages/         # Page components
│   │   ├── routes/        # Route protection
│   │   └── utils/         # API client, JWT utils
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # DB & Cloudinary config
│   │   ├── controllers/   # Route handlers
│   │   ├── middlewares/   # Auth, validation, error
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🔧 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd project_5
   ```

2. **Setup Environment**
   
   Server `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pg-finder
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
   
   Client `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Install Dependencies**
   ```bash
   # Server
   cd server && npm install
   
   # Client
   cd ../client && npm install
   ```

4. **Start Development**
   ```bash
   # Terminal 1 - Server
   cd server && npm run dev
   
   # Terminal 2 - Client
   cd client && npm run dev
   ```

5. **Access App**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 👥 User Roles

- **Students**: Browse, book, review PGs
- **Owners**: Create listings, manage bookings, handle inquiries

## 📱 Key Pages

- **Home**: Browse PGs with filters
- **PG Details**: View listing details and reviews
- **Owner Dashboard**: Manage listings and bookings
- **Auth**: Login/Register with role selection

## 🚀 Deployment

**Frontend:** Build with `npm run build` and deploy to Vercel/Netlify  
**Backend:** Deploy to Railway/Heroku with MongoDB Atlas


---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

**Built with ❤️ using React & Node.js**