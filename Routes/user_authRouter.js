const user_authController = require("../Controller/user_authController");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");


const router = require("express").Router();

router.post("/signup", signupValidation, user_authController.signup);
router.post("/login", loginValidation, user_authController.login);
router.post("/forgot-password", user_authController.forgotPassword);
router.post("/reset-password", user_authController.resetPassword);
router.get("/getAllUsers", user_authController.getAllUsers);
router.get("/:id", user_authController.getUserById);
router.put("/:id", user_authController.updateUser);
router.delete("/:id", user_authController.deleteUser);

module.exports = router;
