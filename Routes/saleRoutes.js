const router = require("express").Router();
const salesController = require("../Controller/saleController");

router.post("/insert", salesController.createSale);
router.get("/", salesController.getAllSales);
router.get("/:id", salesController.getSaleById);
router.put("/:id", salesController.updateSale);
router.delete("/:id", salesController.deleteSale);

module.exports = router;
