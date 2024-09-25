const express = require("express");
musicianRoutes = require("../routes/musicians")
const db = require("../db/connection");

const app = express();
//TODO: Create a GET /musicians route to return all musicians
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/musicians", musicianRoutes);


module.exports = app;
