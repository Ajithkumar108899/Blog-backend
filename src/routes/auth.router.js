const router = require("express").Router();
const { register, login, logout, refreshToken } = require("../controllers/auth.controller");
const { validateRegister, validateLogin, validateRefreshToken } = require("../validations/auth.validation");

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh-token", validateRefreshToken, refreshToken);
router.post("/logout", logout);

module.exports = router;
