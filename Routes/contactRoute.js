const router = require("express").Router();
const contactController = require("../Controller/contactController");

router.post("/", contactController.ContactForm);

module.exports = router;
