const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config()
connectDB

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT || 500, ()=>{
    console.log("Server is Running");
})