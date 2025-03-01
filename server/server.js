import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import helmet from "helmet";
import apiRoutes from "./routes/apiRoutes.js";
import htmlRoutes from "./routes/htmlRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const strapiUrl = process.env.STRAPI_API_URL;

app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/images", express.static(path.join(__dirname, "../images")));
app.use("/fonts", express.static(path.join(__dirname, "../css/fonts")));
app.use(
  "/fonts/ionicons/fonts",
  express.static(path.join(__dirname, "../css/fonts/ionicons/fonts"))
); // Serve ionicons fonts correctly

app.use(cors());

// Use middleware
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure CSP to allow images and styles from external sources
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", strapiUrl, "http:", "https:"], // Allow images from Strapi server and other http/https sources
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allow styles from Google Fonts
      fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"], // Allow fonts from Google Fonts
      connectSrc: ["'self'", strapiUrl], // Allow connections to Strapi server
    },
  })
);

// Use routes
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
