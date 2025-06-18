import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import router from './routes/auth.routes.js';
import connectDB from './lib/db.js';
import messageRoutes from './routes/messege.routes.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS setup
app.use(cors({
  origin: 'https://chatapp-frontend-ytyc.onrender.com',
  credentials: true,
}));

// ✅ Increase JSON and form data size limits to handle base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'view')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});
app.use('/api/auth', router);
app.use('/api/messege', messageRoutes);

// Start Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
