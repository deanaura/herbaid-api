const { v4: uuidv4 } = require("uuid");
const { storage, uploadBytes, getDownloadURL, ref } = require("../config/firebase");
const { db, collection, addDoc } = require("../config/firebase");

// Fungsi untuk mengunggah gambar ke Firebase Storage
const uploadImageToStorage = async (file) => {
  try {
    const storageRef = ref(storage, 'image-identify'); // Menggunakan ref() untuk merujuk ke path penyimpanan yang benar
    const fileName = file.name; // Nama file yang ingin Anda gunakan pada Firebase Storage
    const imageRef = ref(storageRef, fileName);

    await uploadBytes(imageRef, file); // file adalah buffer atau blob dari gambar

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
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    await uploadImageToStorage(file);
  }
});

// Fungsi untuk menyimpan data herbal yang teridentifikasi ke Firestore
const saveIdentifiedHerbalData = async (identifiedHerbal) => {
  try {
    // Simpan data herbal ke koleksi 'herbals' di Firestore
    const herbalRef = collection(db, "herbals");
    const newHerbalDoc = await addDoc(herbalRef, { name: identifiedHerbal });

    return { identifiedHerbal };
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
    const herbalDetail = await HerbalModel.getHerbalData(herbalId);
    res.status(200).json(herbalDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk mendapatkan resep berdasarkan herbal
exports.getRecipesByHerbal = async (req, res) => {
  try {
    const { herbalId } = req.params;
    const herbalDetail = await HerbalModel.getHerbalData(herbalId);

    const recipeIds = herbalDetail.recipeIds || []; // Ganti recipeIds dengan properti yang sesuai di model herbal
    const recipes = await RecipeModel.getRecipesByIds(recipeIds);

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};