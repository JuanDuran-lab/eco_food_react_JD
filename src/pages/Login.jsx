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
import Register from "./Register";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      if (!user.emailVerified) {
        await signOut(auth);
        Swal.fire(
          "Correo no verificado",
          "Debes verificar tu correo electrónico antes de iniciar sesión.",
          "warning"
        );
        return;
      }

      const datos = await getUserData(user.uid);
      console.log("Bienvenido", datos.nombre, "Tipo:", datos.tipo);
      navigate("/home");
    } catch (error) {
      Swal.fire("Error", "Credenciales incorrectas", "error");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Swal.fire("Atención", "Por favor, ingresa tu correo para recuperar la contraseña", "info");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire("Correo enviado", "Revisa tu bandeja para restablecer la contraseña", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar el correo de recuperación", "error");
    }
  };

  return (
  <div className="container mt-5">
    {mostrarRegistro ? (
      <>
        <Register />
        <p className="text-center mt-3">
          ¿Ya tienes cuenta?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setMostrarRegistro(false)}
          >
            Inicia sesión
          </span>
        </p>
      </>
    ) : (
      <>
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
          ¿No tienes cuenta?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setMostrarRegistro(true)}
          >
            Regístrate aquí
          </span>
        </p>
      </>
    )}
  </div>
);
}
