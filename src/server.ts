import express from 'express';
import userRouter from './routes/user.js';

const app = express();
app.use(express.json());

app.use('/api', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});