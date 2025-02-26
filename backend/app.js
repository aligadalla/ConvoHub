import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";

import authRouter from "./auth/auth.routes.js";
import errorMiddleware from "./utils/errorMiddleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use(errorMiddleware);

connectDB().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})