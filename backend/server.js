import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';

const app = express();

// Middlewares
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow all Vercel domains
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow your specific domains
    const allowedOrigins = [
      'https://blog-application-uq46.vercel.app',
      'https://blog-application-fkfo.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

// Initialize database connection
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log('Server is running on port ' + PORT)
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    startServer();
}

export default app;