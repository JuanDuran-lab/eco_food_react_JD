import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  obtenerTotalProductos,
  getProductosByEmpresaPagina,
} from "../../services/productoService";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

TablaProductos.propTypes = {
  userData: PropTypes.object,
  busqueda: PropTypes.string,
  eliminar: PropTypes.func.isRequired,
  abrirModal: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
  orderBy: PropTypes.string,
  orderDir: PropTypes.string,
};

export default function TablaProductos({
  userData,
  busqueda,
  eliminar,
  abrirModal,
  refreshTrigger,
  orderBy,
  orderDir,
}) {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [sinMas, setSinMas] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [pageSize, setPageSize] = useState(10);
  const [recargaForzada, setRecargaForzada] = useState(0);

  const recargar = () => {
    if (!userData?.uid) return;
    setPagina(0);
    setHistorial([]);
    setRecargaForzada((prev) => prev + 1);
  };

  useEffect(() => {
    if (!userData?.uid) return;
    const obtenerCantidad = async () => {
      const cantidad = await obtenerTotalProductos(
        userData.uid,
        busqueda,
        estadoFiltro
      );
      setTotal(cantidad);
    };
    obtenerCantidad();
    setPagina(0);
    setHistorial([]);
  }, [userData, busqueda, estadoFiltro, refreshTrigger]);

  useEffect(() => {
    if (!userData?.uid) return;

    const cargarPagina = async () => {
      const cursor = pagina > 0 ? historial[pagina - 1] : null;
      const { productos: nuevos, lastVisible } =
        await getProductosByEmpresaPagina(
          userData.uid,
          cursor,
          busqueda,
          estadoFiltro,
          pageSize,
          orderBy,
          orderDir === "asc"
        );
      setProductos(nuevos);
      setHistorial((prev) => {
        const copia = [...prev];
        copia[pagina] = lastVisible;
        return copia;
      });
      setSinMas(nuevos.length < pageSize);
    };

    cargarPagina();
  }, [
    pagina,
    userData,
    busqueda,
    estadoFiltro,
    pageSize,
    orderBy,
    orderDir,
    refreshTrigger,
    recargaForzada,
  ]);

const renderBadges = (producto) => {
  const badges = [];

  // Badge de estado (color por estado)
  const estadoColor =
    producto.estado === "vencido"
      ? "danger"
      : producto.estado === "porVencer"
      ? "warning"
      : "success";

  badges.push(
    <span
      key="estado"
      className={`badge bg-${estadoColor} me-2`}
    >
      {producto.estado?.toUpperCase()}
    </span>
  );

  // Badge gratuito
  if (producto.precio === 0) {
    badges.push(
      <span key="gratis" className="badge bg-primary me-2">
        GRATUITO
      </span>
    );
  }

  return badges;
};


  return (
    <div className="row">
      <div className="col-12 d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(e) => {
              setEstadoFiltro(e.target.value);
              recargar();
            }}
          >
            <option value="todos">Todos</option>
            <option value="disponible">Disponibles</option>
            <option value="porVencer">Por vencer</option>
            <option value="vencido">Vencidos</option>
          </select>

          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              recargar();
            }}
          >
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
          </select>
        </div>

        <p className="mb-0">Total: {total}</p>
      </div>

      {busqueda && orderBy !== "nombre" && (
        <div className="col-12">
          <p className="text-warning small">
            * La búsqueda por nombre solo funciona al ordenar por nombre.
          </p>
        </div>
      )}

      <div className="col-12">
        {productos.length === 0 ? (
          <p className="text-muted text-center">
            No hay productos que coincidan con los filtros.
          </p>
        ) : (
          <ul className="list-group mb-3">
            {productos.map((p) => (
              <li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{p.nombre}</strong> - ${p.precio} &nbsp;
                  {renderBadges(p)}
                  <small className="text-muted">Cantidad: {p.cantidad}</small>
                </div>
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => abrirModal(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminar(p.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="col-auto">
        <ul className="pagination">
          <li className={`page-item ${pagina < 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPagina((p) => p - 1)}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          </li>
          <li className={`page-item ${sinMas ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPagina((p) => p + 1)}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
