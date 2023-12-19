const { v4: uuidv4 } = require("uuid");
const { storage, uploadBytes, getDownloadURL } = require("firebase/storage");
const { db, collection, addDoc } = require("../config/firebase");

// Fungsi untuk mengunggah gambar ke Firebase Storage
const uploadImageToStorage = async (file) => {
  try {
    const storageRef = storage.ref(); 
    const fileName = `${uuidv4()}_${file.originalname}`;
    const imageRef = storageRef.child(`image-identify/${fileName}`); 

    await uploadBytes(imageRef, file.buffer); 

    const imageUrl = await getDownloadURL(imageRef); 
    return imageUrl;
  } catch (error) {
    throw error;
  }
};

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
