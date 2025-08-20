const API_URL = "http://localhost:3005";
const tbody = document.querySelector("#Pizza tbody");
let pedidosGlobal = [];

document.addEventListener("DOMContentLoaded", cargarPedidos);

// Cargar pedidos en estado "preparar"
async function cargarPedidos() {
  try {
    const res = await fetch(`${API_URL}/pedidos`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const pedidos = await res.json();
    if (!Array.isArray(pedidos)) throw new Error("Respuesta inesperada del servidor");

    pedidosGlobal = pedidos;

    const porPreparar = pedidos.filter(p => p.estado?.toLowerCase().trim() === "preparar");

    tbody.innerHTML = "";

    if (porPreparar.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center">No hay pedidos por preparar</td>
        </tr>
      `;
      return;
    }

    porPreparar.forEach(pedido => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${pedido.platillo}</td>
        <td>${pedido.mesa || "No tenemos mesas jeje"}</td>
        <td>${pedido.estado}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editarPedido(${pedido.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    alert("No se pudo obtener los pedidos");
  }
}

// Eliminar pedido
async function eliminarPedido(id) {
  if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;

  try {
    const res = await fetch(`${API_URL}/pedido`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (!res.ok) {
      const texto = await res.text();
      console.error("Respuesta no válida:", texto);
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.success) {
      alert("Pedido eliminado correctamente");
      cargarPedidos();
    } else {
      alert(data.message || "Error al eliminar el pedido");
    }
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    alert("No se pudo conectar con el servidor");
  }
}

// Mostrar modal con datos del pedido
function editarPedido(id) {
  const pedido = pedidosGlobal.find(p => p.id === id);
  if (!pedido) return alert("Pedido no encontrado");

  document.getElementById("editId").value = pedido.id;
  document.getElementById("editPlatillo").value = pedido.platillo;
  document.getElementById("editPrecio").value = pedido.precio;
  document.getElementById("editMesa").value = pedido.mesa;
  document.getElementById("editCantidad").value = pedido.cantidad;
  document.getElementById("editObs").value = pedido.observaciones || "";
  document.getElementById("editCliente").value = pedido.cliente || "";
  document.getElementById("editFecha").value = pedido.fecha?.slice(0, 16);

  const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
  modal.show();
}

// Guardar cambios del pedido editado
document.getElementById("formEditar").addEventListener("submit", async (e) => {
  e.preventDefault();

  const pedidoEditado = {
    id: parseInt(document.getElementById("editId").value),
    platillo: document.getElementById("editPlatillo").value.trim(),
    precio: parseFloat(document.getElementById("editPrecio").value),
    cantidad: parseInt(document.getElementById("editCantidad").value),
    mesa: parseInt(document.getElementById("editMesa").value),
    observaciones: document.getElementById("editObs").value.trim() || "Sin observaciones",
    cliente: document.getElementById("editCliente").value.trim() || "Sin cliente",
    fecha: new Date(document.getElementById("editFecha").value).toISOString(),
    estado: "por preparar"

  };

  try {
    const res = await fetch(`${API_URL}/pedido`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedidoEditado)
    });

    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    const data = await res.json();

    if (data.success) {
      alert("Pedido actualizado correctamente");
      bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
      cargarPedidos();
    } else {
      alert(data.message || "Error al actualizar el pedido");
    }
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    alert("No se pudo conectar con el servidor");
  }
});
