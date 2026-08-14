const crudFactory = require("../utils/crudFactory");
const Speaker = require("../models/Speaker");

module.exports = crudFactory(Speaker, "Speaker");
