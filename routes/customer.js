const router = require("express").Router();
const {
  getCustomer,
  createCustomer,
  updateCustomer,
  getAllCustomers,
  deleteCustomer,
  getCustomerByUniqueId,
  uploadModels,
  deleteModel,
  getAllModelsByCustomer,
} = require("../controllers/customer.js");
const {
  customerValidator,
  updateCustomerValidator,
  isValidated,
} = require("../middleware/validators");
const upload = require("../middleware/multer.js");

// create Customer
router.post("/", customerValidator, isValidated, createCustomer);
// delete Customer By User
router.delete("/:id", deleteCustomer);
// update Customer
router.put("/:id", updateCustomerValidator, isValidated, updateCustomer);
// get Customer
router.get("/:id", getCustomer);
// get Customer by uniqueId
router.get("/uniqueId/:id", getCustomerByUniqueId);

// get All Customers
router.get("/", getAllCustomers);
// get all models for customer
router.post("/getModels", getAllModelsByCustomer);
// upload models for specific customer
router.post("/uploadModel/:id", upload("/", "models", "array"), uploadModels);
// delete model url
router.post("/deleteModel", deleteModel);

// Export
module.exports = router;
