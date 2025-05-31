const router = require("express").Router();
const salesController = require("../Controller/saleController");

// Create a new sale
router.post("/insert", salesController.createSale);

// Get all sales
router.get("/", salesController.getAllSales);

// Get a single sale by ID
router.get("/:id", salesController.getSaleById);

// Update a sale by ID
router.put("/:id", salesController.updateSale);

// Delete a sale by ID
router.delete("/:id", salesController.deleteSale);

module.exports = router;
