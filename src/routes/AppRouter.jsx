import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Login from "../pages/Login";
import RegisterCliente from "../pages/RegisterCliente";
import RegisterEmpresa from "../pages/RegisterEmpresa";
import Home from "../pages/Home";

// Páginas empresa
import PerfilEmpresa from "../pages/empresa/PerfilEmpresa";
import ProductosEmpresa from "../pages/empresa/ProductosEmpresa";

// Protección
import ProtectedRoute from "./ProtectedRoute";
import ProtectedByRole from "./ProtectedByRole";

// Páginas admin
import AdminLayout from "../components/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminEmpresas from "../pages/admin/AdminEmpresas";
import AdminClientes from "../pages/admin/AdminClientes";
import AdminAdministradores from "../pages/admin/AdminAdministradores";
import AdminProductosEmpresa from "../pages/admin/AdminProductosEmpresa"; // ✅ Nueva ruta

// Páginas cliente
import ClienteEmpresas from "../pages/cliente/ClienteEmpresas";
import ClienteProductosEmpresa from "../pages/cliente/ClienteProductosEmpresa";
import PerfilCliente from "../pages/cliente/PerfilCliente";


export default function AppRouter() {
  return (
    <Routes>
      {/* 🌐 Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro-cliente" element={<RegisterCliente />} />
      <Route path="/registro-empresa" element={<RegisterEmpresa />} />

      {/* 🏠 Inicio general */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* 🔐 ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedByRole allowed={["admin"]}>
            <AdminLayout />
          </ProtectedByRole>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="administradores" element={<AdminAdministradores />} />
        <Route path="productos-empresa/:empresaId" element={<AdminProductosEmpresa />} /> {/* ✅ Ruta nueva */}
      </Route>

      {/* 🏢 EMPRESA */}
      <Route
        path="/empresa/perfil"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <PerfilEmpresa />
          </ProtectedByRole>
        }
      />
      <Route
        path="/empresa/productos"
        element={
          <ProtectedByRole allowed={["empresa"]}>
            <ProductosEmpresa />
          </ProtectedByRole>
        }
        
      />
      {/* 👤 CLIENTE */}
<Route
  path="/cliente/empresas"
  element={
    <ProtectedByRole allowed={["cliente"]}>
      <ClienteEmpresas />
    </ProtectedByRole>
  }
/>
<Route
  path="/cliente/productos/:empresaId"
  element={
    <ProtectedByRole allowed={["cliente"]}>
      <ClienteProductosEmpresa />
    </ProtectedByRole>
  }
/>
<Route
  path="/cliente/perfil"
  element={
    <ProtectedByRole allowed={["cliente"]}>
      <PerfilCliente />
    </ProtectedByRole>
  }
/>
<Route
  path="/cliente/empresa/:empresaId"
  element={
    <ProtectedByRole allowed={["cliente"]}>
      <ClienteProductosEmpresa />
    </ProtectedByRole>
  }
/>

    </Routes>
    
  );
}

