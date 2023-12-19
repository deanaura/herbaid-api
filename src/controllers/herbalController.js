const { v4: uuidv4 } = require("uuid");
const { storage, uploadBytes, getDownloadURL, ref } = require("../config/firebase");
const { db, collection, addDoc, getDoc, doc } = require("../config/firebase"); // Import 'doc' from firebase
const HerbalModel = require("../models/herbalModel");

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

// Gunakan fungsi ini untuk mengunggah file
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    await uploadImageToStorage(file);
  }
});

// Fungsi untuk menyimpan data herbal yang teridentifikasi ke Firestore
const saveIdentifiedHerbalData = async (identifiedHerbal) => {
  try {
    const herbalRef = collection(db, "herbals");
    const newHerbalDoc = await addDoc(herbalRef, { name: identifiedHerbal });

    return { id: newHerbalDoc.id, name: identifiedHerbal }; // Return ID dan nama herbal yang disimpan
  } catch (error) {
    throw error;
  }
};


// Fungsi untuk mengelola permintaan identifikasi herbal dari endpoint
exports.identifyHerbal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Proses gambar untuk identifikasi herbal
    const imageUrl = await uploadImageToStorage(req.file);

    // Placeholder untuk hasil identifikasi (nama herbal)
    const identifiedHerbal = "Nama Herbal yang Teridentifikasi";

    // Simpan hasil identifikasi ke Firestore
    const savedHerbal = await saveIdentifiedHerbalData(identifiedHerbal);

    res.status(200).json(savedHerbal);
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
      // Lakukan proses jika diperlukan untuk memformat atau memanipulasi data herbalData
      res.status(200).json({ herbalData });
    } else {
      res.status(404).json({ message: "Herbal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk mendapatkan resep berdasarkan ID herbal
exports.getRecipesByHerbal = async (req, res) => {
  try {
    const { herbalId } = req.params;
    const recipesRef = db.collection('Recipes').where('herbalId', 'array-contains', herbalId);
    const snapshot = await recipesRef.get();

    if (snapshot.empty) {
      res.status(404).json({ message: "Recipes not found for this herbal" });
      return;
    }

    const recipes = [];
    snapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() }); // Mengambil ID dokumen dan data resep
    });

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

