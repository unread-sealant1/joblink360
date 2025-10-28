const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
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

// Allowed origin
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Preflight handling
app.options('*', cors({
  origin: allowedOrigin,
  credentials: true,
}));

// Health check
app.get('/', (req, res) => res.send('JobLink360 backend running'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// -------------------- SOCKET.IO --------------------
const io = new Server(server, {
  cors: { origin: allowedOrigin, credentials: true }
});

// Authenticate Socket.io connections using JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Not authorized'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    if (userId) socket.join(userId);
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
    } catch (err) {
      console.error('Socket error:', err);
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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
