const { db, collection, doc, getDoc, query, where, getDocs } = require("../config/firebase");

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

// Dapatkan data herbal berdasarkan nama herbal
const getHerbalByName = async (herbalName) => {
  try {
    const herbalsRef = collection(db, "herbals");
    const q = query(herbalsRef, where("name", "==", herbalName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const herbalData = querySnapshot.docs[0].data();
      return herbalData;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHerbalById,
  getHerbalByName,
};
