const { db, doc, getDoc } = require("../config/firebase");

// Mendapatkan data herbal dari database berdasarkan ID herbal
exports.getHerbalData = async (herbalId) => {
  try {
    const herbalData = await db.collection('herbals').doc(herbalId).get();
    if (herbalData.exists()) {
      return processHerbalData(herbalData.data(), herbalId);
    } else {
      throw new Error("Herbal not found");
    }
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
      return [];
    }

    const recipes = snapshot.docs.map(doc => doc.data());
    return recipes;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk memproses data herbal jika diperlukan
exports.processHerbalData = (herbalData, herbalId) => {
  const processedData = {
    herbalId: herbalId,
    name: herbalData.name,
    imageURL: herbalData.imageURL,
    about: herbalData.about,
    benefits: herbalData.benefits,
    recipeIds: herbalData.recipeId // Menambahkan field recipeIds
  };
  return processedData;
};