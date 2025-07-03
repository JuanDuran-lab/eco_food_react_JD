import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import Swal from "sweetalert2";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  setDoc
} from "firebase/firestore";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: ""
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarProductos, setMostrarProductos] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchEmpresas = async () => {
    const snapshot = await getDocs(collection(db, "empresas"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEmpresas(lista);
  };

  const validarRut = (rut) => /^[0-9]{7,8}-[0-9Kk]$/.test(rut);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarRut(form.rut)) {
      alert("RUT inválido. Usa el formato 12345678-K");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Correo electrónico inválido");
      return;
    }

    if (editandoId) {
      await setDoc(doc(db, "empresas", editandoId), form);
      Swal.fire("Actualizado", "Empresa editada correctamente", "success");
      setEditandoId(null);
    } else {
      await addDoc(collection(db, "empresas"), form);
      Swal.fire("Creada", "Empresa agregada correctamente", "success");
    }

    setForm({
      nombre: "",
      rut: "",
      direccion: "",
      comuna: "",
      email: "",
      telefono: ""
    });
    fetchEmpresas();
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la empresa.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "empresas", id));
      fetchEmpresas();
    }
  };

  const handleEdit = (empresa) => {
    setForm({
      nombre: empresa.nombre,
      rut: empresa.rut,
      direccion: empresa.direccion,
      comuna: empresa.comuna,
      email: empresa.email,
      telefono: empresa.telefono
    });
    setEditandoId(empresa.id);
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <h2>{editandoId ? "Editar Empresa" : "Crear Empresa"}</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        {[
          { name: "nombre", label: "Nombre" },
          { name: "rut", label: "RUT" },
          { name: "direccion", label: "Dirección" },
          { name: "comuna", label: "Comuna" },
          { name: "email", label: "Email", type: "email" },
          { name: "telefono", label: "Teléfono", type: "tel" }
        ].map(({ name, label, type = "text" }) => (
          <div className="mb-3" key={name}>
            <label className="form-label">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="form-control"
              required={name !== "telefono"}
              pattern={name === "telefono" ? "[0-9]+" : undefined}
            />
          </div>
        ))}

        <button type="submit" className="btn btn-primary">
          {editandoId ? "Actualizar Empresa" : "Agregar Empresa"}
        </button>
      </form>

      <h3>Empresas Registradas</h3>
      <ul className="list-group">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <span>{empresa.nombre} - {empresa.rut}</span>
              <div>
                <button
                  className="btn btn-secondary btn-sm me-2"
                  onClick={() => setMostrarProductos(empresa.id)}
                >
                  Ver productos
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(empresa)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(empresa.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>

            {mostrarProductos === empresa.id && (
              <div className="mt-3">
                <h6>Productos Asociados</h6>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Nombre Producto</th>
                      <th>Código</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        No hay productos asociados aún.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
