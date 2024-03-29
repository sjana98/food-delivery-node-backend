const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();

const authController = require("./controllers/authController");
const productController = require("./controllers/productController");
const uploadController = require("./controllers/uploadController");

const app = express();

// concect DB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL);

// middlewares 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/auth", authController);
app.use("/product", productController);
app.use("/upload", uploadController);
app.use("/images", express.static("public/images"));

// start server
app.listen(process.env.LISTEN_PORT, () => console.log("Server has been started successfully!"));