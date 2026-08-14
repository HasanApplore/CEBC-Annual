const crudFactory = require("../utils/crudFactory");
const Partner = require("../models/Partner");

module.exports = crudFactory(Partner, "Partner");
