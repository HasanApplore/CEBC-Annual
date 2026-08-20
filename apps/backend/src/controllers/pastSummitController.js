const crudFactory = require("../utils/crudFactory");
const PastSummit = require("../models/PastSummit");

module.exports = crudFactory(PastSummit, "Past summit");
