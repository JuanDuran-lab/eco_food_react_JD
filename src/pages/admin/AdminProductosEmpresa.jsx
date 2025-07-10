import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductosByEmpresa } from "../../services/productoService";

export default function AdminProductosEmpresa() {
  const { empresaId } = useParams(); // ← empresaId desde la URL
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const docs = await getProductosByEmpresa(empresaId);
        setProductos(docs);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (empresaId) {
      fetchProductos();
    }
  }, [empresaId]);

  return (
    <div className="container mt-4">
      <h3>Productos de la Empresa</h3>

      {loading ? (
        <p>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-muted">No hay productos asociados aún.</p>
      ) : (
        <ul className="list-group">
          {productos.map((p) => (
            <li
              key={p.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{p.nombre}</strong> - ${p.precio}
                {/* Estado del producto */}
                {p.estado && (
                  <span
                    className={`badge ms-2 bg-${
                      p.estado === "vencido"
                        ? "danger"
                        : p.estado === "porVencer"
                        ? "warning"
                        : "success"
                    }`}
                  >
                    {p.estado.toUpperCase()}
                  </span>
                )}

                {/* Producto gratuito */}
                {p.precio === 0 && (
                  <span className="badge bg-primary ms-2">GRATUITO</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
