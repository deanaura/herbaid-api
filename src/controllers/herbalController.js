const { v4: uuidv4 } = require("uuid");
const { storage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const imageProcessing = require("../utils/imageProcessing");
const { db, collection, addDoc } = require("../config/firebase");

// Fungsi untuk mengunggah gambar ke Firebase Storage
const uploadImageToStorage = async (file) => {
  try {
    const storageRef = ref(storage); // Dapatkan referensi dari Firebase Storage

    const fileName = `${uuidv4()}_${file.originalname}`;
    const imageRef = ref(storageRef, `images/${image-identify}`); // Rujuk ke lokasi penyimpanan

    await uploadBytes(imageRef, file.buffer); // Lakukan pengunggahan gambar ke lokasi yang ditentukan

    const imageUrl = await getDownloadURL(imageRef); // Dapatkan URL unduhan gambar yang diunggah
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
