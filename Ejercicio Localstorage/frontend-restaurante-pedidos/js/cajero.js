const API_URL = "http://localhost:3005";

// Detectar todos los botones de pedido
document.querySelectorAll(".btn-pedido").forEach(btn => {
  btn.addEventListener("click", () => {
    const form = btn.closest("form");
    const section = btn.closest(".menu");

    const platillo = form.querySelector(".platillo").value.trim();
    const cliente = form.querySelector(".cliente").value.trim();
    const cantidad = parseInt(form.querySelector(".cantidad").value);
    const fecha = form.querySelector(".fecha").value;
    const observaciones = form.querySelector(".observaciones").value.trim();

    // Detectar precio según sección
    let precio = 0;
    if (section.id === "Pizza") {
      precio = extraerPrecio(section.querySelector(".precioPizza")?.textContent || "0");
    } else if (section.id === "Pasta") {
      precio = extraerPrecio(section.querySelector(".precioPasta")?.textContent || "0");
    } else if (section.id === "Starter") {
      precio = extraerPrecio(section.querySelector(".precioSopa")?.textContent || "0");
    }

    // Validación básica
    if (!platillo || !cliente || !cantidad || !fecha || !observaciones || isNaN(precio)) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    const pedido = {
      platillo,
      precio,
      mesa: "Sin asignar",
      cantidad,
      observaciones,
      cliente,
      fecha,
      estado: "por preparar"
    };

    registrarPedido(pedido);
  });
});

function extraerPrecio(texto) {
  return parseFloat(texto.replace(/[^0-9.]/g, "")) || 0;
}

async function registrarPedido(pedido) {
  try {
    const res = await fetch(`${API_URL}/pedido`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido)
    });

    const data = await res.json();

    if (data.success) {
      alert("Pedido registrado correctamente");
    } else {
      alert(data.message || "Error al registrar el pedido");
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
    alert("No se pudo conectar con el servidor");
  }
}
