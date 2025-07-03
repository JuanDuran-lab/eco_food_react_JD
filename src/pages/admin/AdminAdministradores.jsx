import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import Swal from "sweetalert2";

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "" });

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const adminsFiltrados = admins.filter((admin) =>
    admin.nombre.toLowerCase().startsWith(busqueda.toLowerCase())
  );

  const fetchAdmins = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const lista = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.tipo === "admin");
    setAdmins(lista);
  };

  const handleDelete = async (id, esPrincipal) => {
    if (esPrincipal) {
      Swal.fire("Error", "No puedes eliminar al administrador principal", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Eliminar administrador?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "usuarios", id));
      fetchAdmins();
    }
  };

  const handleEditar = (admin) => {
    if (admin.esPrincipal) {
      Swal.fire("Error", "No puedes editar al administrador principal", "error");
      return;
    }

    setForm({ nombre: admin.nombre, email: admin.email });
    setModoEdicion(true);
    setIdEditando(admin.id);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email) return;

    await updateDoc(doc(db, "usuarios", idEditando), form);
    setModoEdicion(false);
    setIdEditando(null);
    setForm({ nombre: "", email: "" });
    fetchAdmins();
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Gestión de Administradores</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar administrador por nombre..."
          className="form-control"
          value={busqueda}
          onChange={handleBusquedaChange}
        />
      </div>

      {modoEdicion && (
        <form onSubmit={handleUpdate} className="mb-4">
          <h4>Editar Administrador</h4>
          <div className="mb-3">
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="form-control"
              placeholder="Nombre"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Correo"
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Actualizar
          </button>
        </form>
      )}
      <ul className="list-group mt-3">
        {adminsFiltrados.map((admin) => (
          <li
            key={admin.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {admin.nombre} - {admin.email}
              {admin.esPrincipal && <strong> (Principal)</strong>}
            </span>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEditar(admin)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(admin.id, admin.esPrincipal)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

