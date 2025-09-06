import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js';
import adminRouter from './routes/adminRoutes.js';
import blogRouter from './routes/blogRoutes.js';

const app = express();

// Initialize database connection
let dbConnected = false;
const initDB = async () => {
    if (!dbConnected) {
        try {
            await connectDB();
            dbConnected = true;
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Failed to connect to database:', error);
            throw error;
        }
    }
};

// Middlewares
const corsOptions = {
    origin: '*', // Allow requests from anywhere
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize database for each request in serverless environment
app.use(async (req, res, next) => {
    try {
        await initDB();
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Routes
app.get('/', (req, res) => res.send("API is Working"));
app.get('/api', (req, res) => res.json({ message: "API is Working", status: "success" }));
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server for local development
const startServer = async () => {
    try {
        await initDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log('Server is running on port ' + PORT);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Only start server in local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    startServer();
}

export default app;