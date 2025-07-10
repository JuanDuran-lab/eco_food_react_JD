import CardProducto from "../components/CardProducto";
import CerrarSesion from "../components/CerrarSesion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Bienvenido a EcoFood</h2>
      <CerrarSesion />

      {userData?.tipo === "admin" && (
        <div className="mt-3">
          <button className="btn btn-dark" onClick={() => navigate("/admin/dashboard")}>
            Ir al panel de administración
          </button>
        </div>
      )}

      {userData?.tipo === "empresa" && (
        <div className="mt-3">
          <button className="btn btn-primary" onClick={() => navigate("/empresa/perfil")}>
            Ir al perfil de empresa
          </button>
        </div>
      )}

      {userData?.tipo === "cliente" && (
        <div className="mt-3">
          <button className="btn btn-success" onClick={() => navigate("/cliente/empresas")}>
            Ver empresas disponibles
          </button>
        </div>
      )}

      {/* Producto decorativo */}
      <CardProducto nombre="Pan Integral" precio="$500" />
    </div>
  );
}

export default Home;
