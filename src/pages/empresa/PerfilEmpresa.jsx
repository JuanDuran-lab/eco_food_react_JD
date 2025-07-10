import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CerrarSesion from "../../components/CerrarSesion"; // ✅ Importa componente del profe

export default function PerfilEmpresa() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [modoEdicion, setModoEdicion] = useState(false);

  const [form, setForm] = useState({
    nombreEmpresa: "",
    rutEmpresa: "",
    razonSocial: "",
    direccion: "",
    comuna: "",
    email: ""
  });

  useEffect(() => {
    if (userData) {
      setForm({
        nombreEmpresa: userData.nombreEmpresa || "",
        rutEmpresa: userData.rutEmpresa || "",
        razonSocial: userData.razonSocial || "",
        direccion: userData.direccion || "",
        comuna: userData.comuna || "",
        email: userData.email || ""
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validar = () => {
    if (form.nombreEmpresa.length < 3 || form.nombreEmpresa.length > 100) {
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      const ref = doc(db, "usuarios", userData.docId);
      await updateDoc(ref, {
        nombreEmpresa: form.nombreEmpresa,
        razonSocial: form.razonSocial,
        direccion: form.direccion,
        comuna: form.comuna
      });
      Swal.fire("Éxito", "Perfil actualizado correctamente", "success");
      setModoEdicion(false);
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire("Error", "No se pudo actualizar el perfil", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Hola, {form.nombreEmpresa}</h2>
        <CerrarSesion /> {/* ✅ Botón de cierre reutilizable */}
      </div>

      <p>Desde aquí puedes editar tu perfil de empresa y administrar tus productos.</p>

      {!modoEdicion ? (
        <>
          <div className="mt-4">
            <p><strong>RUT:</strong> {form.rutEmpresa}</p>
            <p><strong>Razón Social:</strong> {form.razonSocial}</p>
            <p><strong>Dirección:</strong> {form.direccion}</p>
            <p><strong>Comuna:</strong> {form.comuna}</p>
            <p><strong>Correo:</strong> {form.email}</p>
          </div>

          <button className="btn btn-warning me-2" onClick={() => setModoEdicion(true)}>
            Editar Datos
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/empresa/productos")}>
            Ir a Gestión de Productos
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label className="form-label">Nombre Empresa</label>
            <input
              type="text"
              className="form-control"
              name="nombreEmpresa"
              value={form.nombreEmpresa}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">RUT Empresa</label>
            <input
              type="text"
              className="form-control"
              value={form.rutEmpresa}
              disabled
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Razón Social</label>
            <input
              type="text"
              className="form-control"
              name="razonSocial"
              value={form.razonSocial}
              onChange={handleChange}
              maxLength={100}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              maxLength={200}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Comuna</label>
            <input
              type="text"
              className="form-control"
              name="comuna"
              value={form.comuna}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

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

          <button type="submit" className="btn btn-success me-2">
            Guardar Cambios
          </button>
          <button type="button" className="btn btn-secondary me-2" onClick={() => setModoEdicion(false)}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
