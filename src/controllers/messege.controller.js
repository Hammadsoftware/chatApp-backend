import User from "../models/auth.model.js";
import Message from "../models/messege.model.js"; // recommend renaming to message.model.js

const messageController = {
  // Fetch all users except the logged-in one
  getUsersForSidebar: async (req, res) => {
    try {
      const loginUser = req.user._id;
      const users = await User.find({ _id: { $ne: loginUser } });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users for sidebar:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all messages between sender and receiver
  getMessage: async (req, res) => {
    try {
      const { sender_id, receiver_id } = req.body;
      if (!sender_id || !receiver_id) {
        return res.status(400).json({ message: "Sender and receiver IDs are required" });
      }

      const messages = await Message.find({
        $or: [
          { senderId: sender_id, receiverId: receiver_id },
          { senderId: receiver_id, receiverId: sender_id }
        ]
      }).sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Send a message (text or image)
  sendMessage: async (req, res) => {
    try {
      const { text, image, senderId, receiverId } = req.body;

      if (!senderId || !receiverId) {
        return res.status(400).json({ message: "Sender and receiver IDs are required" });
      }

      if (!text && !image) {
        return res.status(400).json({ message: "Either text or image is required" });
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image,
      });

      await newMessage.save();
      res.status(200).json(newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default messageController;
