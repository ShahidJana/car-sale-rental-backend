const authenticateProducts = require("../Middlewares/AuthProduct");

const router = require("express").Router();

router.get("/", authenticateProducts, (req, res) => {
    console.log('.......User is Loggedin.....',req.user)
  res.status(200).json([
    {
      name: "Mobile",
      price: 10000,
    },
    {
      name: "TV",
      price: 20000,
    },
  ]);
});
module.exports = router;
