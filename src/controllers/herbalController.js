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

// Fungsi untuk mendapatkan resep berdasarkan ID herbal
exports.getRecipesByHerbal = async (req, res) => {
  try {
    const { herbalId } = req.params;
    const recipesRef = db.collection('Recipes').where('herbalId', '==', herbalId);
    const snapshot = await recipesRef.get();

    if (snapshot.empty) {
      res.status(404).json({ message: "Recipes not found for this herbal" });
      return;
    }

    const recipes = snapshot.docs.map(doc => doc.data());

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk mendapatkan detail herbal berdasarkan ID herbal
exports.getHerbalDetail = async (req, res) => {
  try {
    const { herbalId } = req.params;
    const herbalRef = doc(db, "herbals", herbalId);
    const herbalSnapshot = await getDoc(herbalRef);

    if (herbalSnapshot.exists()) {
      const herbalData = herbalSnapshot.data();
      res.status(200).json({ herbalData });
    } else {
      res.status(404).json({ message: "Herbal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk identifikasi herbal dari gambar yang diunggah
exports.identifyHerbal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Proses identifikasi herbal dari gambar
    const imageUrl = await uploadImageToStorage(req.file);
    const identifiedHerbal = await identifyHerbalML(imageUrl); // Menggunakan ML untuk identifikasi

    const savedHerbal = await saveIdentifiedHerbalData(identifiedHerbal);

    res.status(200).json(savedHerbal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Gunakan fungsi ini untuk mengunggah file
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    await uploadImageToStorage(file);
  }
});

// Fungsi untuk mendapatkan detail herbal berdasarkan gambar yang diunggah
exports.getHerbalByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Proses identifikasi herbal dari gambar
    const imageUrl = await uploadImageToStorage(req.file);
    const identifiedHerbal = await identifyHerbalML(imageUrl); // Menggunakan ML untuk identifikasi

    // Mendapatkan detail herbal berdasarkan nama herbal yang teridentifikasi
    const herbalData = await HerbalModel.getHerbalData(identifiedHerbal.name); // Menggunakan fungsi getHerbalData dari herbalModel

    if (!herbalData) {
      res.status(404).json({ message: "Herbal data not found" });
      return;
    }

    // Mendapatkan resep berdasarkan ID herbal
    const recipes = await HerbalModel.getRecipesByHerbalId(herbalData.herbalId); // Menggunakan fungsi getRecipesByHerbalId dari herbalModel

    const processedData = {
      herbalData: {
        herbalId: herbalData.herbalId,
        name: herbalData.name,
        imageURL: herbalData.imageURL,
        about: herbalData.about,
        benefits: herbalData.benefits,
        recipeIds: herbalData.recipeIds 
      },
      recipes: recipes
    };

    res.status(200).json(processedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};