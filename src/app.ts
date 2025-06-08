import express from 'express';
import userRoutes from '@/routes/userRoutes';
import eventRoutes from '@/routes/eventRoutes';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/events', eventRoutes);

export default app;
