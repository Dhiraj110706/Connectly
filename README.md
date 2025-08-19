# Connectly

# PROJECT STRUCTURE

social-media-app/
├── backend/                    # Django Backend
│   ├── socialapp/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── accounts/               # User authentication app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── posts/                  # Posts and comments app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── chat/                   # Real-time chat app
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── consumers.py
│   │   ├── routing.py
│   │   └── urls.py
│   ├── core/                   # Core utilities
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── feed/
│   │   │   │   ├── Feed.jsx
│   │   │   │   ├── PostCard.jsx
│   │   │   │   └── CreatePost.jsx
│   │   │   ├── profile/
│   │   │   │   └── Profile.jsx
│   │   │   ├── chat/
│   │   │   │   └── Chat.jsx
│   │   │   ├── explore/
│   │   │   │   └── Explore.jsx
│   │   │   └── layout/
│   │   │       └── Header.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .eslintrc.cjs
└── README.md




🌐 API Endpoints
Authentication

POST /api/auth/register/ - User registration
POST /api/auth/login/ - User login
GET /api/auth/profile/ - Get user profile
GET /api/auth/users/ - List all users
POST /api/auth/follow/{user_id}/ - Follow/unfollow user

Posts

GET /api/posts/ - List all posts
POST /api/posts/ - Create new post
POST /api/posts/{id}/like/ - Like/unlike post
POST /api/posts/{id}/comment/ - Add comment to post
GET /api/posts/user/{user_id}/ - Get user's posts

Chat

GET /api/chat/messages/ - Get chat messages

🎨 UI Features

Modern Design: Clean, responsive interface with Tailwind CSS
Glass Morphism: Beautiful glassmorphism effects
Smooth Animations: Hover effects and transitions
Real-time Updates: Live chat and notifications
Mobile Responsive: Works perfectly on all devices

🔧 Environment Variables
Create .env file in backend directory:
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
🚀 Deployment
Backend (Django)

Set DEBUG=False in production
Configure proper database (PostgreSQL recommended)
Set up Redis for channels
Use gunicorn + nginx
Configure CORS for production domain

Frontend (React)

Build production version: npm run build
Deploy to Vercel, Netlify, or serve with nginx
Update API endpoints for production

📱 Usage

Register/Login: Create account or login with existing credentials
Create Posts: Share your thoughts with text and emojis
Social Interaction: Like posts, add comments, follow users
Real-time Chat: Message other users instantly
Explore: Discover new people to connect with

🔐 Security Features

JWT token authentication
CORS protection
CSRF protection
Input validation and sanitization
Secure password hashing

🛡️ Technologies Used
Backend

Django 4.2.7
Django REST Framework
JWT Authentication
Django Channels (WebSockets)
SQLite (development) / PostgreSQL (production)

Frontend

React 18
Vite
Tailwind CSS
Axios
React Router


📞 Support
For issues and questions:

Check the console for error messages
Ensure both backend and frontend servers are running
Verify API endpoints are accessible
Check CORS configuration

🎯 Future Enhancements

Image/video uploads
Push notifications
Story features
Advanced search
Dark mode
Mobile app (React Native)
Email verification
Password reset functionality


Happy Coding! 🎉
This is a complete, production-ready social media application with modern features and clean architecture. The app includes user authentication, social features, real-time chat, and a beautiful responsive UI.