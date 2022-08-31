const router = require("express").Router();
const { userLogin, userRegister, resetPass, getUsers, deleteUser } = require("../controllers/user.js");

router.post("/userRegister", userRegister);
router.get("/getAll", getUsers)
router.delete("/delete/:id", deleteUser)
router.post("/userLogin", userLogin);
router.put("/resetPass", resetPass);

module.exports = router;
