const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const CountryRoutes = require("./Country");
const ActivityRoutes = require("./Activity");

const { Country, Activity } = require("../db");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/Country", CountryRoutes);
router.use("/Activity", ActivityRoutes);

module.exports = router;
