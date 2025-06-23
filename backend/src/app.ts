import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import voiceoverRoutes from './routes/voiceover';
import logger from './utils/logger';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/voiceover', voiceoverRoutes);

// Error handling
app.use(errorHandler);

const PORT = config.port || 3001;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app; 