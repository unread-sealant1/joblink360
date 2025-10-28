const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Message = require('./models/Message');

const app = express();
const server = createServer(app);

// Connect to MongoDB
connectDB();

// ✅ Use a single allowed origin string
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
<<<<<<< HEAD
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://joblink360.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
=======
>>>>>>> 37c466411682a9c1c96334b4838a8fba680ff211
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check route (optional but helpful)
app.get('/', (req, res) => {
  res.send('JobLink360 backend is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Socket.IO setup with correct CORS
const io = new Server(server, {
  cors: {
<<<<<<< HEAD
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL || 'https://joblink360.vercel.app'] 
      : ['http://localhost:3000'],
=======
    origin: allowedOrigin,
>>>>>>> 37c466411682a9c1c96334b4838a8fba680ff211
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    if (userId) socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const message = await Message.create({
        sender: data.senderId,
        recipient: data.recipientId,
        content: data.content
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name profileImage')
        .populate('recipient', 'name profileImage');

      io.to(data.recipientId).emit('newMessage', populatedMessage);
      io.to(data.senderId).emit('messageSent', populatedMessage);
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
