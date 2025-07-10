import { db, secondaryAuth } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

// Obtener empresas desde la colección 'usuarios'
export const getEmpresas = async () => {
  const q = query(collection(db, "usuarios"), where("tipo", "==", "empresa"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Registrar empresa en Auth + Firestore
export const registrarEmpresaConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      datos.email,
      datos.password
    );

    await sendEmailVerification(cred.user);

    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombreEmpresa: datos.nombreEmpresa || "",
      rutEmpresa: datos.rutEmpresa || "",
      razonSocial: datos.razonSocial || "",
      direccion: datos.direccion || "",
      comuna: datos.comuna || "",
      telefono: datos.telefono || "",
      tipo: "empresa",
      email: datos.email || "",
    });

    await secondaryAuth.signOut(); // Muy importante
    return cred;
  } catch (error) {
    console.error("Error registrando empresa:", error);
    throw error;
  }
};

// Editar empresa
export const updateEmpresa = async (id, data) => {
  const ref = doc(db, "usuarios", id);
  return await updateDoc(ref, data);
};

// Eliminar empresa
export const deleteEmpresa = async (id) => {
  const ref = doc(db, "usuarios", id);
  return await deleteDoc(ref);
};
