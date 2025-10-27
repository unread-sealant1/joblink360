import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
const [socket, setSocket] = useState(null);
const [onlineUsers, setOnlineUsers] = useState([]);
const { user } = useAuth();

useEffect(() => {
if (user) {
// Use environment variable for backend URL in production
const backendURL =
process.env.NODE_ENV === 'production'
? process.env.REACT_APP_BACKEND_URL || '[https://joblink360.onrender.com](https://joblink360.onrender.com)'
: '[http://localhost:5000](http://localhost:5000)';

```
  const newSocket = io(backendURL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  newSocket.emit('join', user._id);
  setSocket(newSocket);

  return () => {
    newSocket.close();
    setSocket(null);
  };
}
```

}, [user]);

return (
<SocketContext.Provider value={{ socket, onlineUsers }}>
{children}
</SocketContext.Provider>
);
};

export const useSocket = () => {
const context = useContext(SocketContext);
if (!context) {
throw new Error('useSocket must be used within SocketProvider');
}
return context;
};
