const API_URL = "http://localhost:3005"; // Ajusta si usas otro puerto

document.querySelector(".btn-iniciar").addEventListener("click", async (e) => {
  e.preventDefault(); // Por si está dentro de un <form>

  const user = document.getElementById("user").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!user || !password) {
    alert("Por favor completa todos los campos");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password })
    });

    const data = await res.json();
    console.log("Respuesta del backend:", data);

    const usuario = data.user; // ← Aquí está el objeto correcto
    const rol = usuario?.rol;

    if (data.success && rol) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
      console.log("Redirigiendo a:", `${rol}.html`);
      window.location.href = `${rol}.html`;
    } else {
      alert(data.message || "Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("No se pudo conectar con el servidor");
  }
});
