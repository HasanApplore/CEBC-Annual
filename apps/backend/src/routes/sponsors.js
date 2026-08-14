const crudRoutes = require("../utils/crudRoutes");
const controller = require("../controllers/sponsorController");

const router = crudRoutes(controller);
router.get("/grouped", controller.getGroupedByTier);

module.exports = router;
