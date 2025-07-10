import { useState, useEffect } from "react";
import { db, auth } from "../../services/firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { secondaryAuth } from "../../services/firebase";
import Swal from "sweetalert2";

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "" });
  const [showModal, setShowModal] = useState(false);
  const [nuevoAdmin, setNuevoAdmin] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const fetchAdmins = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const lista = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.tipo === "admin");
    setAdmins(lista);
  };

  const handleDelete = async (id, esPrincipal, email) => {
    const currentUser = auth.currentUser;

    if (esPrincipal) {
      Swal.fire(
        "Error",
        "No puedes eliminar al administrador principal",
        "error"
      );
      return;
    }

    if (email === currentUser.email) {
      Swal.fire("Error", "No puedes eliminar tu propia cuenta", "error");
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email) return;

    await updateDoc(doc(db, "usuarios", idEditando), {
      nombre: form.nombre,
    });

    setModoEdicion(false);
    setIdEditando(null);
    setForm({ nombre: "", email: "" });
    fetchAdmins();
  };

  const registrarAdmin = async () => {
    const { nombre, email, password } = nuevoAdmin;

    if (!nombre || !email || !password) {
      Swal.fire("Error", "Completa todos los campos", "error");
      return;
    }

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passRegex.test(password)) {
      Swal.fire(
        "Error",
        "La contraseña debe tener mínimo 6 caracteres, con letras y números",
        "error"
      );
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      await sendEmailVerification(cred.user);

      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre,
        email,
        tipo: "admin",
      });

      await secondaryAuth.signOut();

      Swal.fire(
        "Administrador creado",
        "Se envió un correo de verificación",
        "success"
      );
      setShowModal(false);
      setNuevoAdmin({ nombre: "", email: "", password: "" });
      fetchAdmins();
    } catch (error) {
      console.error("Error creando admin:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const adminsFiltrados = admins.filter((admin) =>
    admin.nombre.toLowerCase().startsWith(busqueda.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Gestión de Administradores</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar administrador por nombre..."
          className="form-control"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
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
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
              className="form-control"
              disabled
            />
          </div>
          <button type="submit" className="btn btn-success">
            Actualizar
          </button>
        </form>
      )}

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        Nuevo Administrador
      </button>

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
                onClick={() =>
                  handleDelete(admin.id, admin.esPrincipal, admin.email)
                }
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Nuevo Administrador</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={nuevoAdmin.nombre}
                  onChange={(e) =>
                    setNuevoAdmin({ ...nuevoAdmin, nombre: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  placeholder="Correo"
                  value={nuevoAdmin.email}
                  onChange={(e) =>
                    setNuevoAdmin({ ...nuevoAdmin, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Contraseña"
                  value={nuevoAdmin.password}
                  onChange={(e) =>
                    setNuevoAdmin({
                      ...nuevoAdmin,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={registrarAdmin}>
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
