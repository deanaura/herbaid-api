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
    // Membuat referensi ke subkoleksi 'recipes' di bawah dokumen herbal yang memiliki ID tertentu
    const recipesRef = collection(db, "herbals", herbalId, "recipes");

    // Melakukan query untuk mendapatkan resep yang terkait dengan herbalId
    const recipesSnapshot = await getDocs(recipesRef);

    // Mengambil data resep dari snapshot jika ada
    const recipes = recipesSnapshot.docs.map((doc) => {
      const data = doc.data();
      // Di sini, Anda dapat melakukan pengolahan atau manipulasi data resep jika diperlukan sebelum dikembalikan
      return {
        id: doc.id,
        ...data // Menambahkan data lain dari dokumen resep
      };
    });

    return recipes;
  } catch (error) {
    throw error;
  }
};
