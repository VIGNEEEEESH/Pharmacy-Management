const bodyParser = require("body-parser");
const express = require("express");
const app=express()
const { default: mongoose } = require("mongoose");
const medicineRoutes=require("./Routes/Medicine-routes")
const cartRoutes=require("./Routes/Cart-routes")

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
app.use("/api/medicine",medicineRoutes)
app.use("/api/cart",cartRoutes)
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rw3waqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(app.listen(5555))
  .catch((err) => {
    console.log(err);
  });
