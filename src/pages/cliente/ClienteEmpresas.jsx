import { useEffect, useState } from "react";
import { getEmpresas } from "../../services/firebaseEmpresa";
import { Link } from "react-router-dom";

export default function ClienteEmpresas() {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      const data = await getEmpresas();
      setEmpresas(data);
    };
    fetchEmpresas();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Empresas Disponibles</h2>
      <ul className="list-group">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{empresa.nombreEmpresa}</span>
            <Link to={`/cliente/empresa/${empresa.id}`} className="btn btn-primary btn-sm">Ver productos</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
