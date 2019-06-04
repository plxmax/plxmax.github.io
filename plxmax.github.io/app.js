const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");

const app = express();
 
mongoose
  .connect(
    "mongodb+srv://plxmax:hS8FEpPIWCt40rmF@cluster0-rvik4.mongodb.net/test"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!"); 
  });
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "angular")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", usersRoutes);
app.use((req, res, next)=>{
  res.sendFile(path.join(__dirname,"angular","index.html"))
});
module.exports = app;
