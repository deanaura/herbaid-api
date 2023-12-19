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
    const recipesRef = collection(db, "Recipes");
    const querySnapshot = await getDocs(recipesRef);

    const recipes = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.herbalId === herbalId) {
        recipes.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return recipes;
  } catch (error) {
    throw error;
  }
};
