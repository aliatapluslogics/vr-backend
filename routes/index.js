const router = require("express").Router();

router.use("/customers", require("./customer"));
router.use("/users", require("./user"));
router.use("/query", require("./hashQuery"))

module.exports = router;
