import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClientes,
  registrarClienteConAuth,
  updateCliente,
  deleteCliente,
} from "../../services/clienteFirebase";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState(""); // 🆕 Estado para buscar

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    rut: "",
    direccion: "",
    comuna: "",
    telefono: "",
    password: ""
  });

  const cargarClientes = async () => {
    const data = await getClientes();
    setClientes(data);
  };

  const validarCampos = () => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const rutRegex = /^[0-9]{7,8}-[0-9Kk]{1}$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (formData.nombre.length < 3 || formData.nombre.length > 100) {
      Swal.fire("Error", "El nombre debe tener entre 3 y 100 caracteres", "error");
      return false;
    }

    if (!clienteActivo && !rutRegex.test(formData.rut)) {
      Swal.fire("Error", "El RUT no es válido. Ej: 12345678-9", "error");
      return false;
    }

    if (!correoRegex.test(formData.email) || formData.email.length > 100) {
      Swal.fire("Error", "Correo inválido o demasiado largo", "error");
      return false;
    }

    if (!clienteActivo && !passRegex.test(formData.password)) {
      Swal.fire("Error", "La contraseña debe tener mínimo 6 caracteres, con letras y números", "error");
      return false;
    }

    if (formData.direccion.length < 5 || formData.direccion.length > 200) {
      Swal.fire("Error", "La dirección debe tener entre 5 y 200 caracteres", "error");
      return false;
    }

    if (formData.comuna.length < 3 || formData.comuna.length > 100) {
      Swal.fire("Error", "La comuna debe tener entre 3 y 100 caracteres", "error");
      return false;
    }

    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) {
      Swal.fire("Error", "El teléfono debe tener entre 7 y 15 dígitos numéricos", "error");
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validarCampos()) return;

    try {
      if (clienteActivo) {
        await updateCliente(clienteActivo.id, formData);
      } else {
        await registrarClienteConAuth(formData);

        Swal.fire(
          "Cliente registrado",
          "Se envió un correo de verificación al cliente. Debe validarlo antes de iniciar sesión.",
          "info"
        );
      }

      setShowModal(false);
      setClienteActivo(null);
      setFormData({
        nombre: "",
        email: "",
        rut: "",
        direccion: "",
        comuna: "",
        telefono: "",
        password: ""
      });
      cargarClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      Swal.fire("Error", "No se pudo guardar el cliente", "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });
    if (result.isConfirmed) {
      await deleteCliente(id);
      cargarClientes();
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3>Clientes Registrados</h3>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setClienteActivo(null);
          setFormData({
            nombre: "",
            email: "",
            rut: "",
            direccion: "",
            comuna: "",
            telefono: "",
            password: ""
          });
          setShowModal(true);
        }}
      >
        Nuevo Cliente
      </button>

      {/* 🔍 Buscador */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre o email..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Comuna</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.comuna}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setClienteActivo(c);
                    setFormData({
                      nombre: c.nombre || "",
                      email: c.email || "",
                      rut: c.rut || "",
                      direccion: c.direccion || "",
                      comuna: c.comuna || "",
                      telefono: c.telefono || "",
                      password: ""
                    });
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(c.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}
                </h5>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  maxLength={100}
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Correo"
                  maxLength={100}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={clienteActivo !== null}
                />

                <input
                  className="form-control mb-2"
                  placeholder="RUT"
                  maxLength={12}
                  value={formData.rut}
                  onChange={(e) =>
                    setFormData({ ...formData, rut: e.target.value })
                  }
                  disabled={clienteActivo !== null}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Dirección"
                  maxLength={200}
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Comuna"
                  maxLength={100}
                  value={formData.comuna}
                  onChange={(e) =>
                    setFormData({ ...formData, comuna: e.target.value })
                  }
                />

                <input
                  className="form-control mb-2"
                  placeholder="Teléfono (opcional)"
                  maxLength={15}
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />

                {!clienteActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    maxLength={100}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={guardar}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
