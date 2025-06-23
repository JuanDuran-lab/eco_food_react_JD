export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  // ✅ Esta función DEBE estar fuera del handleLogin
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
        <p
          style={{ cursor: "pointer", color: "blue", marginTop: "10px" }}
          onClick={handleResetPassword}
        >
          ¿Olvidaste tu contraseña?
        </p>
      </form>
    </div>
  );
}
