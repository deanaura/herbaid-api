const { addComplaintToFirestore, getRecommendedRecipesFromDatabase } = require("../models/complaintModel");

// Menambahkan keluhan ke database
exports.addComplaint = async (complaintType, userId) => {
  try {
    const complaintId = await addComplaintToFirestore(complaintType, userId);
    // Tidak perlu mengambil rekomendasi resep di sini karena sudah dilakukan di addComplaintToFirestore
    return complaintId;
  } catch (error) {
    throw error;
  }
};

// Mendapatkan rekomendasi resep berdasarkan keluhan dari database
exports.getRecommendedRecipes = async (complaintType, userId) => {
  try {
    const recommendedRecipes = await getRecommendedRecipesFromDatabase(complaintType);
    return recommendedRecipes;
  } catch (error) {
    throw error;
  }
};
