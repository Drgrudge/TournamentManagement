import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import hostelRoutes from './routes/hostelRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import scoreRoutes from './routes/scoreRoutes.js';
import userRoutes from './routes/userRoutes.js';
import participationRoutes from './routes/participationRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/hostels', hostelRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/participation', participationRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((err) => console.error(err));
