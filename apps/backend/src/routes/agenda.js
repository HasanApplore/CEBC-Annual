const crudRoutes = require("../utils/crudRoutes");
const controller = require("../controllers/agendaController");

module.exports = crudRoutes(controller);
