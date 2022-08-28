const router = require("express").Router();

router.use("/customers", require("./customer"));
router.use("/users", require("./user"));

module.exports = router;
