import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import router from './routes/auth.routes.js';
import connectDB from './lib/db.js';
import messageRoutes from './routes/messege.routes.js'; // ✅ Renamed for clarity
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'view')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});
app.use('/api/auth', router);
app.use('/api/messege', messageRoutes); // 👈 now it's a normal route handler

// Start Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
