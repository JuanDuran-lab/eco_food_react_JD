import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth";

import Swal from "sweetalert2";
import { getUserData } from "../services/userService";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        await signOut(auth);
        Swal.fire(
          "Verificación requerida",
          "Debes verificar tu correo antes de ingresar.",
          "warning"
        );
        
        return;
      }

      const datos = await getUserData(cred.user.uid);
      if (datos.tipo === "admin") navigate("/admin/dashboard");
      else if (datos.tipo === "cliente") navigate("/cliente/perfil");
      else if (datos.tipo === "empresa") navigate("/empresa/perfil");
      else navigate("/home"); // Fallback por si no tiene tipo definido
    } catch (error) {
      Swal.fire("Error", "Credenciales incorrectas", "error");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Swal.fire(
        "Atención",
        "Por favor, ingresa tu correo para recuperar la contraseña",
        "info"
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire(
        "Correo enviado",
        "Revisa tu bandeja para restablecer la contraseña",
        "success"
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el correo de recuperación", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Iniciar Sesión
        </button>
      </form>

      <p
        style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
        onClick={handleResetPassword}
      >
        ¿Olvidaste tu contraseña?
      </p>

      <p className="text-center mt-3">
        ¿No tienes cuenta?
        <br />
        <button
          className="btn btn-outline-primary mt-2 me-2"
          onClick={() => navigate("/registro-cliente")}
        >
          Soy Cliente
        </button>
        <button
          className="btn btn-outline-success mt-2"
          onClick={() => navigate("/registro-empresa")}
        >
          Soy Empresa
        </button>
      </p>
    </div>
  );
}

