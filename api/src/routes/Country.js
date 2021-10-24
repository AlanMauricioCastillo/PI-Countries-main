const { Router } = require("express");

// Ejemplo: const authRouter = require('./auth.js');
//const { Pokemon } = require("../db");
const {
  getAll,
  getFromId,
  getFiltcontinent,
  getFromName,
  getOrder,
} = require("../controllers/Country");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get("/", getAll);

router.get("/:id", getFromId);

router.get("/", getFromName);

router.get("/order/:order/:column", getOrder);

router.get("/continentFilter/:continent", getFiltcontinent);

module.exports = router;
