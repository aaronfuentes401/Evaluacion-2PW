const express = require("express");
const menu = require("../data/menu");

const router = express.Router();

// GET /api/menu: lista completa de platos con precio y stock
router.get("/", (req, res) => {
  res.json(menu);
});

module.exports = router;
