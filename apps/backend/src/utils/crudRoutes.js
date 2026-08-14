const express = require("express");
const { protect, authorize } = require("../middleware/auth");

// Mirrors the public-GET / admin-only-write pattern shared by every
// ordered-list resource (agenda, speakers, sponsors, partners, gallery).
function crudRoutes({ getAll, create, update, remove }) {
  const router = express.Router();

  router.get("/", getAll);
  router.post("/", protect, authorize("admin"), create);
  router.put("/:id", protect, authorize("admin"), update);
  router.delete("/:id", protect, authorize("admin"), remove);

  return router;
}

module.exports = crudRoutes;
