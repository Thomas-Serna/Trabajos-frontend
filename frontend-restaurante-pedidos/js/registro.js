const API_URL = "http://localhost:3005";

document.querySelector(".btn-guardar").addEventListener("click", async () => {
  const user = document.getElementById("user").value.trim();
  const name = document.getElementById("name").value.trim();
  const rol = document.getElementById("rol").value;
  const password = document.getElementById("password").value.trim();

  if (!user || !name || !rol || !password) {
    alert("Por favor completa todos los campos");
    return;
  }

  const nuevoUsuario = { user, name, rol, password };

  try {
    const res = await fetch(`${API_URL}/register`, { // ← corregido aquí
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoUsuario)
    });

    if (!res.ok) {
      const texto = await res.text();
      console.error("Respuesta no válida:", texto);
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (data.success) {
      alert("Usuario registrado correctamente");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Error al registrar el usuario");
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
    alert("No se pudo conectar con el servidor");
  }
});
