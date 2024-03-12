
const usersRoutes = require("./users.routes");
const platesRoutes = require("./plates.routes");
const ingredientsRoutes = require("./ingredients.routes");
const sessionsRoutes = require("./sessions.routes");

const { Router } = require("express");

const routes = Router();
routes.use("/users", usersRoutes);
routes.use("/plates", platesRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/sessions", sessionsRoutes);

module.exports = routes;