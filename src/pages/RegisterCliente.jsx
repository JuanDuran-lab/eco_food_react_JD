import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";

export default function RegisterCliente() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo] = useState("cliente");
  const navigate = useNavigate();

  const validarRut = (rut) => /^[0-9]{7,8}-[0-9Kk]{1}$/.test(rut);

  const validarCampos = () => {
    if (nombre.length < 3 || nombre.length > 100) {
      Swal.fire("Error", "El nombre debe tener entre 3 y 100 caracteres", "error");
      return false;
    }

    if (!validarRut(rut)) {
      Swal.fire("Error", "El RUT no es válido. Usa el formato 12345678-K", "error");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100) {
      Swal.fire("Error", "El correo no es válido o es muy largo", "error");
      return false;
    }

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passRegex.test(password)) {
      Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres, con letras y números", "error");
      return false;
    }

    if (direccion.length < 5 || direccion.length > 200) {
      Swal.fire("Error", "La dirección debe tener entre 5 y 200 caracteres", "error");
      return false;
    }

    if (comuna.length < 3 || comuna.length > 100) {
      Swal.fire("Error", "La comuna debe tener entre 3 y 100 caracteres", "error");
      return false;
    }

    if (telefono && !/^\d{7,15}$/.test(telefono)) {
      Swal.fire("Error", "El teléfono debe tener entre 7 y 15 dígitos numéricos", "error");
      return false;
    }

    return true;
  };

const handleRegister = async (e) => {
  e.preventDefault();

  if (!validarCampos()) return;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);

    Swal.fire(
      "Revisa tu correo",
      "Te enviamos un email de verificación. Debes validarlo antes de iniciar sesión.",
      "info"
    ).then(async () => {
      await saveUserData(cred.user.uid, {
        nombre,
        rut,
        tipo,
        email,
        direccion,
        comuna,
        telefono
      });

      // ✅ Limpiar campos tras registro exitoso
      setNombre("");
      setRut("");
      setEmail("");
      setPassword("");
      setDireccion("");
      setComuna("");
      setTelefono("");

      // Redirigir al login
      navigate("/login");
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    Swal.fire("Error", error.message, "error");
  }
};


  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => {
              const texto = e.target.value;
              if (texto.length <= 100) setNombre(texto);
            }}
            required
            maxLength={100}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input
            type="text"
            className="form-control"
            value={rut}
            onChange={(e) => {
              const texto = e.target.value;
              if (texto.length <= 12) setRut(texto);
            }}
            required
            placeholder="Ej: 12345678-9"
            maxLength={12}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => {
              const texto = e.target.value;
              if (texto.length <= 100) setEmail(texto);
            }}
            required
            maxLength={100}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => {
              const texto = e.target.value;
              if (texto.length <= 100) setPassword(texto);
            }}
            required
            maxLength={100}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => {
              const texto = e.target.value;
              if (texto.length <= 200) setDireccion(texto);
            }}
            required
            maxLength={200}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input
            type="text"
            className="form-control"
            value={comuna}
            onChange={(e) => {
              const texto = e.target.value;
              if (texto.length <= 100) setComuna(texto);
            }}
            required
            maxLength={100}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => {
              const texto = e.target.value;
              if (texto.length <= 15) setTelefono(texto);
            }}
            maxLength={15}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <input
            type="text"
            className="form-control"
            value="cliente"
            disabled
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-success">
          Registrar
        </button>
      </form>
    </div>
  );
}
