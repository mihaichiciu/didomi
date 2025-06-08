import express from 'express';
import userRoutes from '@/routes/userRoutes';
import eventRoutes from '@/routes/eventRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/events', eventRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
