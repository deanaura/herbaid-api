const { db, collection, getDocs, query, where, arrayContains } = require("../config/firebase");

const addComplaintToFirestore = async (complaintType, userId) => {
  try {
    const complaintsRef = collection(db, "complaints");
    const newComplaint = {
      complaintType,
      userId,
    };
    await addDoc(complaintsRef, newComplaint);
    return { message: "Keluhan berhasil ditambahkan" };
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
      const hasIngredient = recipeData.ingredients && recipeData.ingredients.some((ingredient) => ingredient.name && ingredient.name.toLowerCase() === complaintType.toLowerCase());

      if (hasIngredient) {
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