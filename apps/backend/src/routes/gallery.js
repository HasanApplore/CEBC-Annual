const crudRoutes = require("../utils/crudRoutes");
const controller = require("../controllers/galleryController");

module.exports = crudRoutes(controller);
