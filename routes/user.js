const router = require("express").Router();
const { userLogin, userRegister } = require("../controllers/user.js");

router.post("/userRegister", userRegister);
router.post("/userLogin", userLogin);

module.exports = router;
