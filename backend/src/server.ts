import { config } from 'dotenv';
import app from './app';

// Load environment variables
config();

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  try {
    await app.listen({ port: Number(PORT), host: HOST });
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();