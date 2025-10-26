const Connection = require('../models/Connection');

const sendConnectionRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot connect to yourself' });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    const connection = await Connection.create({
      requester: req.user._id,
      recipient: recipientId
    });

    const populatedConnection = await Connection.findById(connection._id)
      .populate('requester', 'name email')
      .populate('recipient', 'name email');

    res.status(201).json(populatedConnection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToConnection = async (req, res) => {
  try {
    const { connectionId, status } = req.body;
    
    const connection = await Connection.findById(connectionId);
    
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    connection.status = status;
    await connection.save();

    const populatedConnection = await Connection.findById(connection._id)
      .populate('requester', 'name email')
      .populate('recipient', 'name email');

    res.json(populatedConnection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { requester: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .populate('requester', 'name email profileImage')
    .populate('recipient', 'name email profileImage')
    .sort({ createdAt: -1 });

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNetworkUsers = async (req, res) => {
  try {
    const acceptedConnections = await Connection.find({
      $or: [
        { requester: req.user._id, status: 'accepted' },
        { recipient: req.user._id, status: 'accepted' }
      ]
    })
    .populate('requester', 'name email profileImage title')
    .populate('recipient', 'name email profileImage title');

    const networkUsers = acceptedConnections.map(conn => {
      return conn.requester._id.toString() === req.user._id.toString() 
        ? conn.recipient 
        : conn.requester;
    });

    res.json(networkUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendConnectionRequest, respondToConnection, getConnections, getNetworkUsers };