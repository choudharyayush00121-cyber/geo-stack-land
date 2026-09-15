import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import parcelRoutes from './routes/parcelRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import prisma from './prismaClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', parcelRoutes);
app.use('/api/agents', agentRoutes);

// Root health check endpoint
app.get('/', async (req, res) => {
  let dbStatus = 'JSON_FILE_FALLBACK';
  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'CONNECTED_POSTGRES';
    } catch (err) {
      console.error('PostgreSQL health check failed:', err.message);
      dbStatus = 'POSTGRES_UNAVAILABLE';
    }
  }

  res.json({
    name: 'GeoLand Stack - Digital Public Infrastructure (DPI) API Gateway',
    version: '2.0.0',
    status: dbStatus === 'POSTGRES_UNAVAILABLE' ? 'DEGRADED' : 'HEALTHY',
    database: dbStatus,
    sihProblemStatement: '26014 - An Integrated GIS-based Digital Public Infrastructure for Land Governance',
    timestamp: new Date().toISOString()
  });
});

// Start Server with EADDRINUSE port fallback handling
const startServer = (portToTry) => {
  const server = app.listen(portToTry, () => {
    console.log(`====================================================`);
    console.log(`🌍 GeoLand Stack Backend API Running on Port ${portToTry}`);
    console.log(`🚀 DPI Gateway Endpoint: http://localhost:${portToTry}/api/dpi/gateway-status`);
    console.log(`====================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToTry} is in use. Retrying on port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('❌ Server startup error:', err);
    }
  });
};

startServer(Number(PORT));
