// Init
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// customer Validation
exports.customerValidator = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
];
// update customer Validation
exports.updateCustomerValidator = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("first_name", "First Name is required.").notEmpty(),
  check("last_name", "First Name is required.").notEmpty(),
];

/*
======================
Result
======================
*/
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let message = errors.array()[0].msg;
    res.status(400).send({ message: message });
  } else {
    next();
  }
};
