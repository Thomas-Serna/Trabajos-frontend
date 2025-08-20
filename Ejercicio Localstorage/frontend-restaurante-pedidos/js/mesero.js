const API_URL = "http://localhost:3005";

// Elementos de las tablas
const tbodyPorEntregar = document.querySelector("#Pizza tbody");
const tbodyEntregado = document.querySelector("#Pasta tbody");

// Cargar pedidos al iniciar
document.addEventListener("DOMContentLoaded", () => {
  cargarPedidosPorEntregar();
  cargarPedidosEntregados();
});

// Mostrar pedidos por entregar
async function cargarPedidosPorEntregar() {
  try {
    const res = await fetch(`${API_URL}/pedidos`);
    const pedidos = await res.json();

    const porEntregar = pedidos.filter(p => p.estado === "entregar");

    tbodyPorEntregar.innerHTML = "";

    porEntregar.forEach(pedido => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${pedido.platillo}</td>
        <td>${pedido.mesa || "Sin mesa"}</td>
        <td>
          <button class="btn btn-sm btn-success" onclick="marcarEntregado(${pedido.id})">Marcar como entregado</button>
        </td>
      `;

      tbodyPorEntregar.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar pedidos por entregar:", error);
    alert("No se pudo obtener los pedidos");
  }
}

// Mostrar pedidos entregados
async function cargarPedidosEntregados() {
  try {
    const res = await fetch(`${API_URL}/pedidos`);
    const pedidos = await res.json();

    const entregados = pedidos.filter(p => p.estado === "entregado");

    tbodyEntregado.innerHTML = "";

    entregados.forEach(pedido => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${pedido.platillo}</td>
        <td>${pedido.mesa || "Sin mesa"}</td>
        <td>${pedido.estado}</td>
      `;

      tbodyEntregado.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar pedidos entregados:", error);
    alert("No se pudo obtener los pedidos");
  }
}

// Cambiar estado a entregado
async function marcarEntregado(id) {
  try {
    const res = await fetch(`${API_URL}/entregado`, {
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
      alert(`Pedido #${id} marcado como entregado`);
      cargarPedidosPorEntregar();
      cargarPedidosEntregados();
    } else {
      alert(data.message || "Error al actualizar el estado");
    }
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    alert("No se pudo conectar con el servidor");
  }
}
