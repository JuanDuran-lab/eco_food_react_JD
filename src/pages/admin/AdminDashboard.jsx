import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Panel de Administrador</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <Link to="/admin/empresas" className="text-decoration-none">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Empresas</h5>
                <p className="card-text">Gestiona empresas registradas.</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/admin/clientes" className="text-decoration-none">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Clientes</h5>
                <p className="card-text">Visualiza y elimina clientes.</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/admin/administradores" className="text-decoration-none">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">Administradores</h5>
                <p className="card-text">Edita y gestiona administradores.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}