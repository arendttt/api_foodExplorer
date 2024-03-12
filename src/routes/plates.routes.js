const { Router } = require("express");

const multer = require("multer");
const uploadConfig = require("../configs/uploads");

const PlatesController = require("../controllers/PlatesController");
const PlatesImageController = require("../controllers/PlatesImageController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const platesRoutes = Router();

const upload = multer(uploadConfig.MULTER);

const platesController = new PlatesController();
const platesImageController = new PlatesImageController();

platesRoutes.use(ensureAuthenticated);

platesRoutes.post("/", verifyUserAuthorization(["admin"]), upload.single("image"), platesController.create);
platesRoutes.delete("/:id", verifyUserAuthorization(["admin"]), platesController.delete);
platesRoutes.get("/:id", platesController.show);
platesRoutes.get("/", platesController.index);
platesRoutes.put("/:id", verifyUserAuthorization(["admin"]), upload.single("image"), platesController.update);

platesRoutes.patch("/image/:id", verifyUserAuthorization(["admin"]), upload.single("image"), platesImageController.update);

module.exports = platesRoutes;
