const API_URL = "http://localhost:3005";

// Elementos de las tablas
const tbodyPorPreparar = document.querySelector("#Pizza tbody");
const tbodyPreparando = document.querySelector("#Pasta tbody");

// Cargar pedidos al iniciar
document.addEventListener("DOMContentLoaded", () => {
  cargarPedidosPorPreparar();
  cargarPedidosPreparando();
});

// Mostrar pedidos por preparar
async function cargarPedidosPorPreparar() {
  try {
    const res = await fetch(`${API_URL}/pedidos`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const pedidos = await res.json();
    const porPreparar = pedidos.filter(p => p.estado?.toLowerCase().trim() === "preparar");

    tbodyPorPreparar.innerHTML = "";

    porPreparar.forEach(pedido => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${pedido.platillo}</td>
        <td>${pedido.mesa || "Sin mesa"}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="cambiarEstado(${pedido.id}, 'preparando')">Preparar</button>
        </td>
      `;
      tbodyPorPreparar.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar pedidos por preparar:", error);
    alert("No se pudo obtener los pedidos");
  }
}

// Mostrar pedidos en preparación
async function cargarPedidosPreparando() {
  try {
    const res = await fetch(`${API_URL}/pedidos`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

    const pedidos = await res.json();
    const preparando = pedidos.filter(p => p.estado?.toLowerCase().trim() === "preparando");

    tbodyPreparando.innerHTML = "";

    preparando.forEach(pedido => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${pedido.platillo}</td>
        <td>${pedido.mesa || "Sin mesa"}</td>
        <td>
          <button class="btn btn-sm btn-success" onclick="cambiarEstado(${pedido.id}, 'listo')">Listo para entregar</button>
        </td>
      `;
      tbodyPreparando.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar pedidos preparando:", error);
    alert("No se pudo obtener los pedidos");
  }
}

// Cambiar estado del pedido
async function cambiarEstado(id, nuevoEstado) {
  let endpoint = "";

  if (nuevoEstado === "preparando") endpoint = "preparando";
  else if (nuevoEstado === "listo") endpoint = "listo";
  else if (nuevoEstado === "entregado") endpoint = "entregado";
  else {
    alert("Estado no válido");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: "PUT",
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
      alert(`Pedido #${id} actualizado a "${nuevoEstado}"`);
      cargarPedidosPorPreparar();
      cargarPedidosPreparando();
    } else {
      alert(data.message || "Error al actualizar el estado");
    }
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    alert("No se pudo conectar con el servidor");
  }
}
