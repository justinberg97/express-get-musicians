const express = require("express");
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { Musician } = require("../models/index");

//TODO: Create a GET /musicians route to return all musicians
router.get("/", async (req, res) => {
  try {
    const musicians = await Musician.findAll();
    res.json(musicians);
  } catch (error) {
    console.error("Error fetching musicians:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
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

router.post("/", 
    
    [
        check("name").trim().notEmpty().withMessage("Name cannot be empty"),
        check("instrument").trim().notEmpty().withMessage("Instrument cannot be empty"),
    ],
    async (req, res) => {
  

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
    const musician = await Musician.create(req.body);
    const musicians = await Musician.findAll();
    res.status(201).json(musicians);
  } catch (error) {
    console.error("Error creating musician", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedMusician = await Musician.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(updatedMusician);
  } catch (error) {
    console.error("Error updating Musician", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedMusician = await Musician.destroy({
      where: { id: req.params.id },
    });
    res.json(deletedMusician);
  } catch (error) {
    console.error("Error deleting musician", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;