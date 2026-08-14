const crudFactory = require("../utils/crudFactory");
const GalleryImage = require("../models/GalleryImage");

module.exports = crudFactory(GalleryImage, "Gallery image");
