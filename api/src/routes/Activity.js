const { Router } = require("express");

// Ejemplo: const authRouter = require('./auth.js');
//const { Type } = require('../db')

const { newActivity } = require("../controllers/Activity");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.post("/", newActivity);

module.exports = router;
