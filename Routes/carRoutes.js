const router = require("express").Router();
const carController = require("../Controller/carController");
const upload = require("../Middlewares/upload");

router.post("/insert", upload.array("images", 5), carController.createCar); // Allow max 5 images
router.get("/", carController.getAllCars);
router.get("/:id", carController.getCarById);
router.put("/:id/update", upload.array("images", 5), carController.updateCar);
router.delete("/:id", carController.deleteCar);

module.exports = router;
