const { db, collection, query, where, getDocs } = require("../config/firebase");

// Fungsi untuk mendapatkan resep berdasarkan ID herbal dari koleksi 'Recipes'
const getRecipesByHerbalId = async (herbalId) => {
  try {
    const recipesRef = collection(db, "recipes");
    const q = query(recipesRef, where("herbalId", "array-contains", herbalId));
    const querySnapshot = await getDocs(q);

    const recipes = [];
    querySnapshot.forEach((doc) => {
      const recipe = doc.data();
      recipes.push(recipe);
    });

    return recipes;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getRecipesByHerbalId,
};
