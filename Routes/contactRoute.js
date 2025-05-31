const router = require("express").Router();
const contactController = require("../Controller/contactController");

// POST /api/contact
router.post("/", contactController.ContactForm);

module.exports = router;
