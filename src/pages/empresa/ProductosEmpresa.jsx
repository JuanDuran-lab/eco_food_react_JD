import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { deleteProducto } from "../../services/productoService";
import TablaProductos from "./TablaProductos";
import ModalProductos from "./ModalProductos";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function ProductosEmpresa() {
  const { userData } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    vencimiento: "",
    cantidad: 1,
    precio: 0,
    estado: "disponible",
    id: null,
  });

  const [orderBy, setOrderBy] = useState("nombre");
  const [orderDir, setOrderDir] = useState("asc");

  const handleRefresh = () => {
    setRefreshTick((t) => t + 1);
  };

  const eliminar = useCallback(async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "¿Eliminar producto?",
        showCancelButton: true,
      });
      if (confirm.isConfirmed) {
        await deleteProducto(id);
        handleRefresh();
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  }, []);

  const abrirModal = (producto = null) => {
    if (producto) {
      setFormData({ ...producto });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        vencimiento: "",
        cantidad: 1,
        precio: 0,
        estado: "disponible",
        id: null,
      });
    }
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Productos</h2>

      <div className="mb-3 d-flex">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={handleRefresh}>
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>

      <div className="mb-3 d-flex align-items-center gap-2">
        <strong>Ordenar:</strong>
        <button
          className="btn btn-outline-dark btn-sm"
          onClick={() => {
            setOrderBy(orderBy === "nombre" ? "precio" : "nombre");
            handleRefresh();
          }}
        >
          {orderBy === "nombre" ? "Nombre" : "Precio"}
        </button>
        <button
          className="btn btn-outline-dark btn-sm"
          onClick={() => {
            setOrderDir(orderDir === "asc" ? "desc" : "asc");
            handleRefresh();
          }}
        >
          {orderDir === "asc" ? <FaArrowUp /> : <FaArrowDown />}
        </button>
      </div>

      <button className="btn btn-success mb-3" onClick={() => abrirModal()}>
        Agregar Producto
      </button>

      <TablaProductos
        key={refreshTick}
        userData={userData}
        busqueda={busqueda}
        abrirModal={abrirModal}
        eliminar={eliminar}
        refreshTrigger={refreshTick}
        orderBy={orderBy}
        orderDir={orderDir}
      />

      <ModalProductos
        show={showModal}
        setShow={setShowModal}
        userData={userData}
        formData={formData}
        setFormData={setFormData}
        handleRefresh={handleRefresh}
      />
    </div>
  );
}
