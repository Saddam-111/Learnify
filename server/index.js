import express from 'express';
import "dotenv/config";
import cors from 'cors'
import connectDB from './config/db.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoute.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './config/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';


const app = express();
const port = process.env.PORT || 4000;


//database connection
await connectDB();
await connectCloudinary();

//Middleware
app.use(cors())
app.use(clerkMiddleware())


//routes

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/clerk', express.json(), clerkWebhooks);
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course',express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



