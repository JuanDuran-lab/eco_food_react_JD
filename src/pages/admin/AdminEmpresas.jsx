import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getEmpresas,
  registrarEmpresaConAuth,
  updateEmpresa,
  deleteEmpresa,
} from "../../services/firebaseEmpresa";

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    nombreEmpresa: "",
    rutEmpresa: "",
    razonSocial: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
    password: ""
  });
  const [mostrarProductos, setMostrarProductos] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const validarRut = (rut) => /^[0-9]{7,8}-[0-9Kk]$/.test(rut);

  const validarCampos = () => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (form.nombreEmpresa.length < 3 || form.nombreEmpresa.length > 100) {
      Swal.fire("Error", "El nombre debe tener entre 3 y 100 caracteres", "error");
      return false;
    }

    if (!validarRut(form.rutEmpresa)) {
      Swal.fire("Error", "RUT inválido. Ej: 12345678-9", "error");
      return false;
    }

    if (!correoRegex.test(form.email)) {
      Swal.fire("Error", "Correo inválido", "error");
      return false;
    }

    if (!editandoId && !passRegex.test(form.password)) {
      Swal.fire("Error", "Contraseña débil. Usa letras y números (mín. 6)", "error");
      return false;
    }

    if (form.direccion.length < 5 || form.direccion.length > 200) {
      Swal.fire("Error", "Dirección debe tener entre 5 y 200 caracteres", "error");
      return false;
    }

    if (form.comuna.length < 3 || form.comuna.length > 100) {
      Swal.fire("Error", "Comuna inválida", "error");
      return false;
    }

    if (form.telefono && !/^\d{7,15}$/.test(form.telefono)) {
      Swal.fire("Error", "Teléfono inválido", "error");
      return false;
    }

    return true;
  };

  const cargarEmpresas = async () => {
    const data = await getEmpresas();
    setEmpresas(data);
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      if (editandoId) {
        await updateEmpresa(editandoId, { ...form, tipo: "empresa" });
        Swal.fire("Actualizado", "Empresa editada correctamente", "success");
      } else {
        await registrarEmpresaConAuth(form);
        Swal.fire(
          "Empresa registrada",
          "Se envió un correo de verificación. La empresa debe validarlo antes de iniciar sesión.",
          "info"
        );
      }

      setForm({
        nombreEmpresa: "",
        rutEmpresa: "",
        razonSocial: "",
        direccion: "",
        comuna: "",
        email: "",
        telefono: "",
        password: ""
      });
      setEditandoId(null);
      cargarEmpresas();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar la empresa", "error");
    }
  };

  const eliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar empresa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (confirm.isConfirmed) {
      await deleteEmpresa(id);
      cargarEmpresas();
    }
  };

  const editar = (empresa) => {
    setForm({
      nombreEmpresa: empresa.nombreEmpresa,
      rutEmpresa: empresa.rutEmpresa,
      razonSocial: empresa.razonSocial,
      direccion: empresa.direccion,
      comuna: empresa.comuna,
      email: empresa.email,
      telefono: empresa.telefono,
      password: "" // ⚠️ No se puede mostrar ni modificar la contraseña
    });
    setEditandoId(empresa.id);
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

const empresasFiltradas = empresas.filter((e) =>
  e.nombreEmpresa.toLowerCase().includes(busqueda.toLowerCase()) ||
  e.rutEmpresa.toLowerCase().includes(busqueda.toLowerCase())
);

  return (
    <div className="container mt-4">
      <h2>{editandoId ? "Editar Empresa" : "Registrar Nueva Empresa"}</h2>
      <form onSubmit={guardar} className="mb-4">
        {[
          { name: "nombreEmpresa", label: "Nombre Empresa" },
          { name: "rutEmpresa", label: "RUT Empresa" },
          { name: "razonSocial", label: "Razón Social" },
          { name: "direccion", label: "Dirección" },
          { name: "comuna", label: "Comuna" },
          { name: "email", label: "Correo", type: "email" },
          { name: "telefono", label: "Teléfono", type: "tel" }
        ].map(({ name, label, type = "text" }) => (
          <div className="mb-3" key={name}>
            <label className="form-label">{label}</label>
            <input
  type={type}
  name={name}
  className="form-control"
  value={form[name]}
  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
  required={name !== "telefono"}
  maxLength={100}
  disabled={editandoId && (name === "email" || name === "rutEmpresa")}
/>

          </div>
        ))}

        {!editandoId && (
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              maxLength={100}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          {editandoId ? "Actualizar" : "Registrar"}
        </button>
      </form>

<input
  type="text"
  className="form-control mb-3"
  placeholder="Buscar por nombre o RUT..."
  value={busqueda}
  onChange={(e) => setBusqueda(e.target.value)}
/>


      <h3>Empresas Registradas</h3>
      <ul className="list-group">
        {empresasFiltradas.map((empresa) => (
          <li key={empresa.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <span>{empresa.nombreEmpresa} - {empresa.rutEmpresa}</span>
              <div>
               <Link to={`/admin/productos-empresa/${empresa.id}`} className="btn btn-secondary btn-sm me-2">
  Ver productos
</Link>

<button
  className="btn btn-warning btn-sm me-2"
  onClick={() => editar(empresa)}
>
  Editar
</button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(empresa.id)}
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
