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

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: ""
  });

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre?.toLowerCase().startsWith(busqueda.toLowerCase())
  );

  const fetchClientes = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const lista = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.tipo === "cliente");
    setClientes(lista);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "usuarios", id));
      fetchClientes();
    }
  };

  const handleEditar = (cliente) => {
    setForm({
      nombre: cliente.nombre || "",
      email: cliente.email || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || ""
    });
    setModoEdicion(true);
    setIdEditando(cliente.id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "usuarios", idEditando), form);
      Swal.fire("Actualizado", "El cliente fue actualizado", "success");
      setModoEdicion(false);
      setForm({
        nombre: "",
        email: "",
        telefono: "",
        direccion: ""
      });
      setIdEditando(null);
      fetchClientes();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Gestión de Clientes</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar cliente por nombre..."
          className="form-control"
          value={busqueda}
          onChange={handleBusquedaChange}
        />
      </div>

      {modoEdicion && (
        <form onSubmit={handleUpdate} className="mb-4">
          <h4>Editar Cliente</h4>
          <div className="mb-2">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-2">
            <label>Correo</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-2">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-success mt-2">
            Actualizar
          </button>
        </form>
      )}

      <ul className="list-group mt-3">
        {clientesFiltrados.map((cliente) => (
          <li
            key={cliente.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              {cliente.nombre} - {cliente.email}
            </span>
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEditar(cliente)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(cliente.id)}
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
