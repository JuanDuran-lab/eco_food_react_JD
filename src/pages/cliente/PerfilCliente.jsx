import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CerrarSesion from "../../components/CerrarSesion";

export default function PerfilCliente() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const [modoEdicion, setModoEdicion] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: ""
  });

  useEffect(() => {
    if (userData) {
      setForm({
        nombre: userData.nombre || "",
        rut: userData.rut || "",
        direccion: userData.direccion || "",
        comuna: userData.comuna || "",
        email: userData.email || "",
        telefono: userData.telefono || ""
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    if (form.nombre.length < 3 || form.nombre.length > 100) {
      Swal.fire("Error", "El nombre debe tener entre 3 y 100 caracteres", "error");
      return false;
    }
    if (form.direccion.length < 5 || form.direccion.length > 200) {
      Swal.fire("Error", "La dirección debe tener entre 5 y 200 caracteres", "error");
      return false;
    }
    if (form.comuna.length < 3 || form.comuna.length > 100) {
      Swal.fire("Error", "La comuna debe tener entre 3 y 100 caracteres", "error");
      return false;
    }
    if (form.telefono && !/^\d{7,15}$/.test(form.telefono)) {
      Swal.fire("Error", "Teléfono inválido", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      const ref = doc(db, "usuarios", userData.docId);
      await updateDoc(ref, {
        nombre: form.nombre,
        direccion: form.direccion,
        comuna: form.comuna,
        telefono: form.telefono
      });
      Swal.fire("Éxito", "Datos actualizados correctamente", "success");
      setModoEdicion(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Hola, {form.nombre}</h2>
        <CerrarSesion />
      </div>

      {!modoEdicion ? (
        <div className="card p-3 mb-4">
          <h5>Datos del Cliente</h5>
          <p><strong>RUT:</strong> {form.rut}</p>
          <p><strong>Dirección:</strong> {form.direccion}</p>
          <p><strong>Comuna:</strong> {form.comuna}</p>
          <p><strong>Correo:</strong> {form.email}</p>
          <p><strong>Teléfono:</strong> {form.telefono}</p>

          <button className="btn btn-warning me-2" onClick={() => setModoEdicion(true)}>
            Editar datos personales
          </button>
          <button className="btn btn-success" onClick={() => navigate("/cliente/empresas")}>
            Ver empresas
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {[
            { label: "Nombre", name: "nombre" },
            { label: "Dirección", name: "direccion" },
            { label: "Comuna", name: "comuna" },
            { label: "Teléfono", name: "telefono", type: "tel" },
          ].map(({ label, name, type = "text" }) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                className="form-control"
                name={name}
                value={form[name]}
                onChange={handleChange}
                maxLength={100}
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              disabled
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">RUT</label>
            <input
              type="text"
              className="form-control"
              value={form.rut}
              disabled
              readOnly
            />
          </div>

          <button type="submit" className="btn btn-success me-2">Guardar</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setModoEdicion(false)}
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
