const express = require("express");
const multer = require("multer");

const HerbalController = require("../controllers/herbalController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer();

// Endpoint untuk identifikasi herbal
router.post("/identify", authMiddleware, upload.single("herbalImage"), HerbalController.identifyHerbal);

// Endpoint untuk mendapatkan detail herbal berdasarkan ID herbal
router.get("/:herbalId/detail", authMiddleware, HerbalController.getHerbalDetail);

// Endpoint untuk mendapatkan resep berdasarkan ID herbal
router.get("/:herbalId/recipes", authMiddleware, HerbalController.getRecipesByHerbal);

// Endpoint untuk mendapatkan detail herbal berdasarkan gambar yang diunggah
router.post("/identifyByImage", authMiddleware, upload.single("herbalImage"), HerbalController.getHerbalByImage);

module.exports = router;
