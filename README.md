# JobLink360 - Professional Networking Platform

A full-stack LinkedIn-style professional networking platform built with React.js, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Profiles**: Complete profile management with skills, experience, and links
- **Job Postings**: Create, browse, and apply for job opportunities
- **Professional Networking**: Send and manage connection requests
- **Real-time Messaging**: Chat with connections using Socket.io
- **Admin Dashboard**: Complete platform management and analytics
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- React Router DOM
- Tailwind CSS
- Heroicons
- Axios
- Socket.io Client
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Socket.io for real-time features
- Nodemailer for email functionality
- Cloudinary for media storage

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (optional, for image uploads)

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd joblink360
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm run install-all
\`\`\`

### 3. Environment Setup
Create a \`.env\` file in the root directory:

\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=admin@cmmmultiverse.co.za
EMAIL_PASS=your_email_app_password
NODE_ENV=development
\`\`\`

### 4. Seed Admin User
\`\`\`bash
npm run seed
\`\`\`
**Important:** Save the generated admin password displayed in the console!

### 5. Start the application
\`\`\`bash
npm run dev
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 👤 Admin Access

**Admin Login:**
- Email: admin@cmmmultiverse.co.za
- Password: 38e3ec085ab75e805547e83360d13c14
- Access: http://localhost:3000/admin

## 🌐 API Endpoints

### Authentication
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/logout\` - User logout
- \`POST /api/auth/forgot-password\` - Password reset

### Users
- \`GET /api/users\` - Get all users
- \`GET /api/users/:id\` - Get user by ID
- \`PUT /api/users/:id\` - Update user profile
- \`DELETE /api/users/:id\` - Delete user

### Jobs
- \`POST /api/jobs\` - Create job posting
- \`GET /api/jobs\` - Get all jobs
- \`GET /api/jobs/:id\` - Get job by ID
- \`PUT /api/jobs/:id\` - Update job
- \`DELETE /api/jobs/:id\` - Delete job
- \`POST /api/jobs/:id/apply\` - Apply to job

### Connections
- \`POST /api/connections/send\` - Send connection request
- \`POST /api/connections/respond\` - Accept/decline connection
- \`GET /api/connections\` - Get user connections
- \`GET /api/connections/network\` - Get network users

### Messages
- \`POST /api/messages\` - Send message
- \`GET /api/messages/conversations\` - Get conversations
- \`GET /api/messages/:userId\` - Get conversation with user

### Admin
- \`POST /api/admin/login\` - Admin login
- \`GET /api/admin/stats\` - Dashboard statistics
- \`GET /api/admin/users\` - Get all users (admin)
- \`DELETE /api/admin/users/:id\` - Delete user (admin)
- \`GET /api/admin/jobs\` - Get all jobs (admin)
- \`DELETE /api/admin/jobs/:id\` - Delete job (admin)

## 🚀 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: \`cd server && npm install\`
4. Set start command: \`cd server && npm start\`
5. Add environment variables

### Frontend (Vercel)
1. Install Vercel CLI: \`npm i -g vercel\`
2. Build the client: \`cd client && npm run build\`
3. Deploy: \`vercel --prod\`

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update MONGO_URI in environment variables

## 📱 User Roles

### Regular Users
- Create and manage profiles
- Post and apply for jobs
- Connect with other professionals
- Send and receive messages
- Update personal information

### Admin Users
- Access admin dashboard
- View platform statistics
- Manage all users and job postings
- Delete inappropriate content
- Monitor platform activity

## 🔧 Development

### Available Scripts

**Root directory:**
- \`npm run dev\` - Start both frontend and backend
- \`npm run server\` - Start backend only
- \`npm run client\` - Start frontend only
- \`npm run seed\` - Seed admin user

**Server directory:**
- \`npm run dev\` - Start with nodemon
- \`npm start\` - Start production server

**Client directory:**
- \`npm start\` - Start development server
- \`npm run build\` - Build for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email cassidymahlatse@gmail.com or create an issue in the repository.

---

**JobLink360** by Cassidy Mahlatse Masila - Connect. Network. Grow. 🚀