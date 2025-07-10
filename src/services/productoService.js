import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  where,
  query,
  orderBy,
  limit,
  startAt,
  endAt,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";

// ✅ Agrega producto
export const addProducto = async (producto) => {
  const ref = doc(collection(db, "productos"));
  const productoConId = { ...producto, id: ref.id };
  await setDoc(ref, productoConId);
};

// ✅ Edita producto
export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, data);
};

// ✅ Elimina producto
export const deleteProducto = async (id) => {
  const ref = doc(db, "productos", id);
  await deleteDoc(ref);
};

// ✅ Cantidad total (con búsqueda y filtro de estado)
export const obtenerTotalProductos = async (
  empresaId,
  busqueda = "",
  estadoFiltro = "todos"
) => {
  const ref = collection(db, "productos");
  const filtros = [where("empresaId", "==", empresaId)];

  if (estadoFiltro !== "todos") {
    filtros.push(where("estado", "==", estadoFiltro));
  }

  const term = busqueda.trim().toLowerCase();
  let q;

  if (term !== "") {
    // Solo buscar si es por nombre ascendente
    q = query(
      ref,
      ...filtros,
      orderBy("nombre"),
      startAt(term),
      endAt(term + "\uf8ff")
    );
  } else {
    q = query(ref, ...filtros);
  }

  const snap = await getCountFromServer(q);
  return snap.data().count;
};

// ✅ Tamaño por defecto
export const PAGE_SIZE = 5;

// ✅ Obtener productos paginados con filtros y orden
export const getProductosByEmpresaPagina = async (
  empresaId,
  cursor = null,
  busqueda = "",
  estadoFiltro = "todos",
  pageSize = PAGE_SIZE,
  orderByField = "nombre",
  isAsc = true
) => {
  const ref = collection(db, "productos");
  const filtros = [where("empresaId", "==", empresaId)];

  if (estadoFiltro !== "todos") {
    filtros.push(where("estado", "==", estadoFiltro));
  }

  const direction = isAsc ? "asc" : "desc";
  const orden = orderBy(orderByField, direction);

  // 🛡️ Evita error si se intenta buscar por nombre en orden no permitido
  if (
    busqueda.trim() !== "" &&
    (orderByField !== "nombre" || !isAsc)
  ) {
    return { productos: [], lastVisible: null };
  }

  let q;

  if (busqueda.trim() !== "") {
    const term = busqueda.toLowerCase();
    q = query(
      ref,
      ...filtros,
      orden,
      startAt(term),
      endAt(term + "\uf8ff"),
      ...(cursor ? [startAfter(cursor)] : []),
      limit(pageSize)
    );
  } else {
    q = query(
      ref,
      ...filtros,
      orden,
      ...(cursor ? [startAfter(cursor)] : []),
      limit(pageSize)
    );
  }

  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { productos, lastVisible };
};

// ✅ Obtener TODOS los productos de una empresa (sin paginación)
export const getProductosByEmpresa = async (empresaId) => {
  const ref = collection(db, "productos");
  const q = query(ref, where("empresaId", "==", empresaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
