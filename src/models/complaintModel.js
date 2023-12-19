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
    const querySnapshot = await getDocs(query(recipesRef, where("complaintType", "==", complaintType)));

    const recommendedRecipes = [];

    querySnapshot.forEach((doc) => {
      recommendedRecipes.push({
        recipeId: doc.id,
        ...doc.data(),
      });
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