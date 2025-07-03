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

      <CardProducto nombre="Pan Integral" precio="$500" />
    </div>
  );
}

export default Home;
