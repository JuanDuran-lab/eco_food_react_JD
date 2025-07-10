import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductosByEmpresa } from "../../services/productoService";

export default function ClienteProductosEmpresa() {
  const { empresaId } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await getProductosByEmpresa(empresaId);
      setProductos(data);
    };
    fetchProductos();
  }, [empresaId]);

  return (
    <div className="container mt-4">
      <h2>Productos de la Empresa</h2>
      {productos.length === 0 ? (
        <p className="text-muted">No hay productos disponibles.</p>
      ) : (
        <ul className="list-group">
          {productos.map((p) => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{p.nombre}</strong> - ${p.precio}
              </div>
              <button className="btn btn-outline-success btn-sm" disabled>
                Comprar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
