import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/configdb.js";
import db from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import artistRoutes from "./routes/artist.routes.js";
import topicRoutes from "./routes/topic.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import "./workers/image.worker.js";
import "./workers/audio.worker.js";
import "./workers/email.worker.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8088;

app.use(helmet());
// app.use(cors());
app.use(
    cors({
        origin: (origin, callback) => {
            // Cho phép kết nối từ localhost (Development)
            if (!origin || origin.includes("localhost")) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"), false);
        },
        credentials: true, // Cho phép gửi Cookie
    })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// RESTful API Routes (Plural Nouns)
app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/playlists", playlistRoutes);

app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
