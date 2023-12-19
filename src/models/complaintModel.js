const { db, collection, addDoc, getDocs } = require("../config/firebase");

const addComplaintToFirestore = async (complaintType, userId) => {
  try {
    const complaintsRef = collection(db, "complaints");
    const newComplaint = {
      complaintType,
      userId,
    };
    await addDoc(complaintsRef, newComplaint);

    // Tambahkan kode untuk mendapatkan rekomendasi resep berdasarkan complaintType
    const recommendedRecipes = await getRecommendedRecipesFromDatabase(complaintType); // Memperbarui fungsi ini untuk mengambil resep yang sesuai dengan complaintType

    return { message: "Keluhan berhasil ditambahkan", recommendedRecipes };
  } catch (error) {
    throw error;
  }
};


const getRecommendedRecipesFromDatabase = async (complaintType) => {
  try {
    const recipesRef = collection(db, "Recipes");
    const querySnapshot = await getDocs(recipesRef);
    const recommendedRecipes = [];

    querySnapshot.forEach((doc) => {
      const recipeData = doc.data();
      const hasComplaintType = recipeData.complaintType && recipeData.complaintType.includes(complaintType);

      if (hasComplaintType) {
        recommendedRecipes.push({
          recipeId: doc.id,
          name: recipeData.name,
          image: recipeData.image,
          preparationTime: recipeData.preparationTime,
          ingredients: recipeData.ingredients,
          instructions: recipeData.instructions,
          favorite: recipeData.favorite || false,
        });
      }
    });

    return recommendedRecipes;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  addComplaintToFirestore,
  getRecommendedRecipesFromDatabase,
};
