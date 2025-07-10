import { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { addProducto, updateProducto } from "../../services/productoService";

export default function ModalProductos({
  show,
  setShow,
  userData,
  formData,
  setFormData,
  handleRefresh,
}) {
  useEffect(() => {
    if (formData && !formData.estado) {
      setFormData((prev) => ({ ...prev, estado: "disponible" }));
    }
  }, [formData, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    if (!formData.nombre || formData.nombre.length < 2 || formData.nombre.length > 40) {
      Swal.fire("Error", "El nombre debe tener entre 2 y 40 caracteres", "error");
      return false;
    }

    if (formData.descripcion && formData.descripcion.length > 200) {
      Swal.fire("Error", "La descripción no puede superar los 200 caracteres", "error");
      return false;
    }

    const precio = parseFloat(formData.precio);
    if (isNaN(precio) || precio < 0 || precio > 1000000) {
      Swal.fire("Error", "El precio debe ser un número mayor a 0 y menor a $1.000.000", "error");
      return false;
    }

    const cantidad = parseInt(formData.cantidad);
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > 10000) {
      Swal.fire("Error", "La cantidad debe ser un número mayor a 0 y menor a 10.000", "error");
      return false;
    }

    if (!formData.fechaElaboracion || !formData.fechaVencimiento) {
      Swal.fire("Error", "Debes ingresar ambas fechas", "error");
      return false;
    }

    const elaboracion = new Date(formData.fechaElaboracion);
    const vencimiento = new Date(formData.fechaVencimiento);
    if (elaboracion > vencimiento) {
      Swal.fire("Error", "La fecha de elaboración no puede ser posterior a la de vencimiento", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      // Calcular estado automático
      const hoy = new Date();
      const vencimiento = new Date(formData.fechaVencimiento);
      const diffDias = Math.floor((vencimiento - hoy) / (1000 * 60 * 60 * 24));

      let estado = "disponible";
      if (diffDias < 0) estado = "vencido";
      else if (diffDias <= 3) estado = "porVencer";

      // Preparamos objeto limpio (sin "vencimiento")
      const producto = {
        id: formData.id || undefined, // si ya tiene ID lo mantenemos
        empresaId: userData?.docId, // ⚠️ usa docId
        nombre: formData.nombre.trim().toLowerCase(),
        descripcion: formData.descripcion.trim(),
        cantidad: parseInt(formData.cantidad),
        precio: parseFloat(formData.precio),
        fechaElaboracion: formData.fechaElaboracion,
        fechaVencimiento: formData.fechaVencimiento,
        estado,
      };

      if (formData.id) {
        await updateProducto(formData.id, producto);
      } else {
        await addProducto(producto);
      }

      handleRefresh();
      setShow(false);
      Swal.fire("Éxito", "Producto guardado correctamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{formData.id ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              maxLength={40}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              maxLength={200}
              rows={2}
            />
            <Form.Text muted>{formData.descripcion?.length || 0}/200 caracteres</Form.Text>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Cantidad (unidades disponibles)</Form.Label>
            <Form.Control
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              min={1}
              max={10000}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Precio ($ CLP)</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min={0}
              max={1000000}
              step={0.01}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fecha de Elaboración</Form.Label>
            <Form.Control
              type="date"
              name="fechaElaboracion"
              value={formData.fechaElaboracion}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fecha de Vencimiento</Form.Label>
            <Form.Control
              type="date"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancelar
          </Button>
          <Button variant="success" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

