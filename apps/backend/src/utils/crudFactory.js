const catchAsync = require("./catchAsync");
const AppError = require("./appError");

// Shared CRUD handlers for the simple ordered-list content resources
// (agenda items, speakers, sponsors, partners, gallery images). Each of
// these models has the same shape of operations, so this factory avoids
// repeating the same controller five times.
function crudFactory(Model, resourceName) {
  const getAll = catchAsync(async (req, res) => {
    const docs = await Model.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: docs, message: `${resourceName} list` });
  });

  const create = catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc, message: `${resourceName} created` });
  });

  const update = catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError(`${resourceName} not found`, 404));
    res.status(200).json({ success: true, data: doc, message: `${resourceName} updated` });
  });

  const remove = catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError(`${resourceName} not found`, 404));
    res.status(200).json({ success: true, data: null, message: `${resourceName} deleted` });
  });

  return { getAll, create, update, remove };
}

module.exports = crudFactory;
