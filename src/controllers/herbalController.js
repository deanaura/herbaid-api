const { v4: uuidv4 } = require("uuid");
const { storage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const imageProcessing = require("../utils/imageProcessing");
const { db, collection, addDoc } = require("../config/firebase");

// Fungsi untuk mengunggah gambar ke Firebase Storage
const uploadImageToStorage = async (file) => {
  try {
    if (!file) {
      throw new Error("No image provided");
    }

    const storageRef = ref(storage, 'image-identify/' + file.originalname); // Lokasi penyimpanan yang telah dibuat

    // Upload bytes dari file ke lokasi penyimpanan yang ditentukan
    await uploadBytes(storageRef, file.buffer);

    // Dapatkan URL unduhan gambar yang diunggah
    const imageUrl = await getDownloadURL(storageRef);

    return imageUrl;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mengidentifikasi herbal dari gambar
exports.identifyHerbal = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Proses gambar untuk identifikasi herbal
    const imageUrl = await uploadImageToStorage(req.file);
    const identifiedHerbal = await imageProcessing.identifyHerbal(imageUrl);

    // Simpan data herbal ke database
    const herbalRef = collection(db, "herbals");
    const newHerbalDoc = await addDoc(herbalRef, identifiedHerbal);

    res.status(200).json(identifiedHerbal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
