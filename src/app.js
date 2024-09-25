const express = require("express");
const app = express();
const { Musician } = require("../models/index");
const { db } = require("../db/connection");

const port = 3000;
app.use(express.json());

//TODO: Create a GET /musicians route to return all musicians

app.get("/musicians", async (req, res) => {
  try {
    const musicians = await Musician.findAll();
    res.json(musicians);
  } catch (error) {
    console.error("Error fetching musicians:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/musicians/:id", async (req, res) => {
  try {
    const number = req.params.id;
    const musician = await Musician.findByPk(number);
    if (musician) {
      res.json(musician);
    } else {
      res.status(404).json({ error: "No musician with this ID" });
    }
  } catch (error) {
    console.error("Error finding musician by ID", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;
