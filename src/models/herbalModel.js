const { db, collection, getDoc, doc } = require("../config/firebase");

// Dapatkan data herbal berdasarkan ID
const getHerbalById = async (herbalId) => {
  try {
    const herbalRef = doc(db, "herbals", herbalId);
    const herbalSnapshot = await getDoc(herbalRef);

    if (herbalSnapshot.exists()) {
      return herbalSnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHerbalById,
};
