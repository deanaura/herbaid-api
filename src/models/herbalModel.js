const { db, doc, getDoc } = require("../config/firebase");

// Mendapatkan data herbal dari database berdasarkan nama herbal
exports.getHerbalData = async (herbalName) => {
  try {
    const herbalsRef = db.collection('herbals');
    const querySnapshot = await herbalsRef.where('name', '==', herbalName).get();

    if (querySnapshot.empty) {
      return null;
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