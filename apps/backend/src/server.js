require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { connectDatabase } = require("./config/database");
const AppError = require("./utils/appError");

const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/content");
const agendaRoutes = require("./routes/agenda");
const speakerRoutes = require("./routes/speakers");
const sponsorRoutes = require("./routes/sponsors");
const partnerRoutes = require("./routes/partners");
const galleryRoutes = require("./routes/gallery");
const pastSummitRoutes = require("./routes/pastSummits");
const registrationRoutes = require("./routes/registrations");
const uploadRoutes = require("./routes/upload");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ success: true, message: "OK" }));

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/speakers", speakerRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/past-summits", pastSummitRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/upload", uploadRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  if (!err.isOperational) console.error(err);
  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : "Something went wrong.",
  });
});

const PORT = process.env.PORT || 4000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`CEBC backend listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
