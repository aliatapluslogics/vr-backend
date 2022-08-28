const router = require("express").Router();
const { userLogin, userRegister, resetPass } = require("../controllers/user.js");

router.post("/userRegister", userRegister);
router.post("/userLogin", userLogin);
router.put("/resetPass", resetPass);

module.exports = router;
