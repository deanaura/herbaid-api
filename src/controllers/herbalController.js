// Import library yang diperlukan dan konfigurasi Firebase
const { v4: uuidv4 } = require("uuid");
const { storage, uploadBytes, getDownloadURL, ref } = require("../config/firebase");
const { db, collection, addDoc, getDoc, doc } = require("../config/firebase");
const HerbalModel = require("../models/herbalModel");
const HerbalService = require("../services/herbalService");

// Fungsi untuk mengunggah gambar ke Firebase Storage
const uploadImageToStorage = async (file) => {
  try {
    const storageRef = ref(storage, "image-identify");
    const fileName = file.name;
    const imageRef = ref(storageRef, fileName);

    await uploadBytes(imageRef, file);

    const imageUrl = await getDownloadURL(imageRef);
    console.log("Image uploaded. URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Fungsi untuk menyimpan data herbal yang teridentifikasi ke Firestore
const saveIdentifiedHerbalData = async (identifiedHerbal) => {
  try {
    const herbalRef = collection(db, "herbals");
    const newHerbalDoc = await addDoc(herbalRef, { name: identifiedHerbal });

    return { id: newHerbalDoc.id, name: identifiedHerbal };
  } catch (error) {
    throw error;
  }
};


// Fungsi untuk identifikasi herbal dari gambar yang diunggah
exports.identifyHerbal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    const imageUrl = await uploadImageToStorage(req.file);

    const identifiedHerbal = await identifyHerbalML(imageUrl);

    const savedHerbal = await saveIdentifiedHerbalData(identifiedHerbal);

    const herbalId = savedHerbal.id;
    const herbalData = await HerbalModel.getHerbalById(herbalId);

    if (herbalData) {
      const recipes = await HerbalService.getRecipesByHerbalId(herbalData.recipeId);

      res.status(200).json({
        herbalData: {  
          herbalId: herbalData.herbalId,
          name: herbalData.name,
          imageURL: imageUrl,
          about: herbalData.about,
          benefits: herbalData.benefits,
          recipeIds: herbalData.recipeIds,
        },
        recipes: recipes
      });
    } else {
      res.status(404).json({ message: "Herbal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


