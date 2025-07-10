import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";


export default function RegisterEmpresa() {
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [rutEmpresa, setRutEmpresa] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo] = useState("empresa");
  const navigate = useNavigate();

  const validarRut = (rut) => /^[0-9]{7,8}-[0-9Kk]{1}$/.test(rut);

  const validarCampos = () => {
    if (nombreEmpresa.length < 3 || nombreEmpresa.length > 100) {
      Swal.fire("Error", "El nombre de la empresa debe tener entre 3 y 100 caracteres", "error");
      return false;
    }

    if (!validarRut(rutEmpresa)) {
      Swal.fire("Error", "El RUT no es válido. Usa el formato 12345678-K", "error");
      return false;
    }

    if (razonSocial.length < 3 || razonSocial.length > 100) {
      Swal.fire("Error", "La razón social debe tener entre 3 y 100 caracteres", "error");
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
          nombreEmpresa,
          rutEmpresa,
          razonSocial,
          email,
          direccion,
          comuna,
          telefono,
          tipo,
        });

        // Limpiar
        setNombreEmpresa("");
        setRutEmpresa("");
        setRazonSocial("");
        setEmail("");
        setPassword("");
        setDireccion("");
        setComuna("");
        setTelefono("");

        // Redirigir
        navigate("/login");
      });
    } catch (error) {
      console.error("Error en el registro:", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro Empresa</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre Empresa</label>
          <input
            type="text"
            className="form-control"
            value={nombreEmpresa}
            onChange={(e) => setNombreEmpresa(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">RUT Empresa</label>
          <input
            type="text"
            className="form-control"
            value={rutEmpresa}
            onChange={(e) => setRutEmpresa(e.target.value)}
            required
            placeholder="Ej: 12345678-K"
            maxLength={12}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Razón Social</label>
          <input
            type="text"
            className="form-control"
            value={razonSocial}
            onChange={(e) => setRazonSocial(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
            onChange={(e) => setDireccion(e.target.value)}
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
            onChange={(e) => setComuna(e.target.value)}
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
            onChange={(e) => setTelefono(e.target.value)}
            maxLength={15}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de usuario</label>
          <input
            type="text"
            className="form-control"
            value="empresa"
            disabled
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-success">
          Registrar Empresa
        </button>
      </form>
    </div>
  );
}
