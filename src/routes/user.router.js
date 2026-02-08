const router = require("express").Router();
const { getAllUsers, getUserById, deleteUser } = require("../controllers/user.controller");
const { authenticate, authorizeRoles, ROLES } = require("../middlewares/auth.middleware");

router.get("/getAll", authenticate, authorizeRoles(ROLES.ADMIN), getAllUsers);
router.get("/getUserById/:id", authenticate, getUserById);
router.delete("/deleteUserById/:id", authenticate, authorizeRoles(ROLES.ADMIN), deleteUser);

module.exports = router;
