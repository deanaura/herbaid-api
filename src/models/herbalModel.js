const { db, doc, getDoc } = require("../config/firebase");

// Mendapatkan data herbal dari database berdasarkan ID herbal
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

// Fungsi untuk memproses data herbal jika diperlukan
exports.processHerbalData = (herbalData, herbalId) => {
  const processedData = {
    herbalId: herbalId,
    name: herbalData.name,
    imageURL: herbalData.imageURL,
    about: herbalData.about,
    benefits: herbalData.benefits,
    recipeIds: herbalData.recipeId 
  };
  return processedData;
};