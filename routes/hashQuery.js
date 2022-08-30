const router = require("express").Router();
const { deHash, hash, getHash } = require("../controllers/hashQuery.js");

router.post("/hash", hash);
router.post("/de-hash", deHash);
router.post("/get-hash", getHash)

module.exports = router;
