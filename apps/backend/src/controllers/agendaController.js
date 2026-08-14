const crudFactory = require("../utils/crudFactory");
const AgendaItem = require("../models/AgendaItem");

module.exports = crudFactory(AgendaItem, "Agenda item");
