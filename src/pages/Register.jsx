import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveUserData } from "../services/userService";
import { sendEmailVerification } from "firebase/auth";
export default function Register() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [nombre, setNombre] = useState("");
const [tipo, setTipo] = useState("cliente");
const navigate = useNavigate();
const [direccion, setDireccion] = useState("");
const [comuna, setComuna] = useState("");
const [telefono, setTelefono] = useState("");
const handleRegister = async (e) => {
e.preventDefault();
try {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!regex.test(password)) {
    Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres, incluyendo letras y números", "error");
    return;
  }

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await sendEmailVerification(cred.user);
  Swal.fire(
  "Revisa tu correo",
  "Te enviamos un email de verificación. Debes validarlo antes de iniciar sesión.",
  "info"
).then(async () => {
  await saveUserData(cred.user.uid, {
    nombre,
    tipo,
    email,
    direccion,
    comuna,
    telefono
  });

  navigate("/login"); 
});

} catch (error) {
  console.error("Error en el registro:", error);
  Swal.fire("Error", error.message, "error");
}
}
return (
<div className="container mt-5">
<h2>Registro</h2>
<form onSubmit={handleRegister}>
<div className="mb-3">
<label className="form-label">Nombre completo</label>
<input type="text" className="form-control" value={nombre} onChange={(e) =>
setNombre(e.target.value)} required />
</div>
<div className="mb-3">
<label className="form-label">Correo</label>
<input type="email" className="form-control" value={email} onChange={(e) => 
setEmail(e.target.value)} required />
</div>
<div className="mb-3">
<label className="form-label">Contraseña</label>
<input type="password" className="form-control" value={password}
onChange={(e) => setPassword(e.target.value)} required />
</div>
<div className="mb-3">
  <label className="form-label">Dirección</label>
  <input type="text" className="form-control" value={direccion} onChange={(e) =>
    setDireccion(e.target.value)} required />
</div>

<div className="mb-3">
  <label className="form-label">Comuna</label>
  <input type="text" className="form-control" value={comuna} onChange={(e) =>
    setComuna(e.target.value)} required />
</div>

<div className="mb-3">
  <label className="form-label">Teléfono (opcional)</label>
  <input type="tel" className="form-control" value={telefono} onChange={(e) =>
    setTelefono(e.target.value)} />
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
<button type="submit" className="btn btn-success">Registrar</button>
</form>
</div>
);
}