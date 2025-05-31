// salesController.js
const Sale = require("../Models/saleModel");

// Create a new sale
exports.createSale = async (req, res) => {
  try {
    const { carId, userId, price, name, cnic, phoneNo, address } = req.body;
    const sale = new Sale({
      carId,
      userId,
      price,
      name,
      cnic,
      phoneNo,
      address,
    });
    await sale.save();
    res
      .status(201)
      .json({ success: true, message: "Purchase Successfully", sale });
  } catch (error) {
    res.status(500).json({ success: true, error: error.message });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale)
      return res.status(404).json({ success: false, error: "Sale not found" });
    res.status(200).json({ sale });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a sale by ID
exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!sale)
      return res
        .status(404)
        .json({ success: false, error: "Sold cars not found" });
    res
      .status(200)
      .json({ success: true, message: "sold car update successfully", sale });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a sale by ID
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale)
      return res
        .status(404)
        .json({ success: false, error: "Sold car not found" });
    res
      .status(200)
      .json({ success: true, message: "Sold car deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
