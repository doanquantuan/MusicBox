import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/configdb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8088;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Simple home route
app.get("/", (req, res) => {
    res.send("BakeHouse Backend Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
