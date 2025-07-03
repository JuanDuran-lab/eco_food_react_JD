import { Link } from "react-router-dom";
import CerrarSesion from "../../CerrarSesion";
import { useAuth } from "../../../context/AuthContext";

export default function NavAdmin() {
  const { userData } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <span className="navbar-brand">EcoFood Admin - {userData?.nombre}</span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/admin/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/empresas">Empresas</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/clientes">Clientes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admin/administradores">Administradores</Link></li>
          </ul>
          <span className="navbar-text">
            <CerrarSesion />
          </span>
        </div>
      </div>
    </nav>
  );
}
