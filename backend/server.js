import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';

const app = express();

// Middlewares - Allow CORS from anywhere
const corsOptions = {
  origin: true, // Allow all origins
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
        app.listen(PORT, '0.0.0.0', () => {
            console.log('Server is running on port ' + PORT)
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Always start the server (Render needs this)
startServer();

export default app;