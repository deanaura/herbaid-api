const { identifyHerbalML, saveImageToStorage } = require("../utils/imageProcessing");
const { db, collection, query, where, getDocs } = require("../config/firebase");

// Mengunggah gambar herbal ke storage
exports.uploadImage = async (imageFile) => {
  try {
    const imageUrl = await saveImageToStorage(imageFile);
    return imageUrl;
  } catch (error) {
    throw error;
  }
};

// Mengidentifikasi herbal berdasarkan gambar menggunakan machine learning 
exports.identifyHerbal = async (imageUrl) => {
  try {
    const identifiedHerbal = await identifyHerbalML(imageUrl); // Fungsi identifikasi menggunakan ML 

    const herbalsRef = collection(db, "herbals");
    const q = query(herbalsRef, where("name", "==", identifiedHerbal));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Herbal not found");
    }

    // Mengambil data herbal dari Firestore
    const herbalData = querySnapshot.docs[0].data();
    return herbalData;
  } catch (error) {
    throw error;
  }
};

// Mendapatkan resep berdasarkan ID herbal
exports.getRecipesByHerbalId = async (herbalId) => {
  try {
    const recipesRef = db.collection('Recipes').where('herbalId', 'array-contains', herbalId);
    const snapshot = await recipesRef.get();

    if (snapshot.empty) {
      return []; // Return empty array jika resep tidak ditemukan
    }

    const recipes = snapshot.docs.map(doc => doc.data());

    return recipes;
  } catch (error) {
    throw error;
  }
};