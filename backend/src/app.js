import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRoutes from "./routes/user.routes.js";
import questionRoutes from "./routes/question.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/questions", questionRoutes);

export { app };
