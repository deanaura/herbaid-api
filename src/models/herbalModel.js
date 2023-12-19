const { db, collection, doc, getDoc } = require("../config/firebase");

// Mendapatkan data herbal dari Firestore berdasarkan ID herbal
exports.getHerbalData = async (herbalId) => {
  try {
    const herbalRef = doc(db, "herbals", herbalId);
    const herbalSnapshot = await getDoc(herbalRef);

    if (herbalSnapshot.exists()) {
      const herbalData = herbalSnapshot.data();
      return herbalData;
    } else {
      throw new Error("Herbal not found");
    }
  } catch (error) {
    throw error;
  }
};

// Mendapatkan resep berdasarkan ID herbal dari Firestore
exports.getRecipesByHerbalId = async (herbalId) => {
  try {
    const recipesRef = collection(db, "herbals", herbalId, "recipes");
    const recipesSnapshot = await getDocs(recipesRef);

    // Melakukan proses untuk mendapatkan resep sesuai kebutuhan Anda
    const recipes = recipesSnapshot.docs.map((doc) => doc.data());

    return recipes;
  } catch (error) {
    throw error;
  }
};
