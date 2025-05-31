const router = require('express').Router();
const rentalController = require('../Controller/rentalController');

// Define routes
router.post('/', rentalController.createRental);        // Create a new rental
router.get('/', rentalController.getAllRentals);       // Get all rentals
router.get('/:id', rentalController.getRentalById);    // Get rental by ID
router.put('/:id', rentalController.updateRental);     // Update rental
router.delete('/:id', rentalController.deleteRental);  // Delete rental

module.exports = router;
