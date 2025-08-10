const productos = {
  entradas: [
    { nombre: "Guacamole", precio: 65, imagen: "guacamole.jpg" },
    { nombre: "Sopa de tortilla", precio: 55, imagen: "sopa-tortilla.jpg" },
    { nombre: "Quesadillas", precio: 60, imagen: "quesadillas.jpg" }
  ],
  platos: [
    { nombre: "Enchiladas", precio: 110, imagen: "enchiladas.jpg" },
    { nombre: "Pozole", precio: 120, imagen: "pozole.jpg" },
    { nombre: "Tacos al pastor", precio: 95, imagen: "tacos-pastor.jpg" }
  ],
  bebidas: [
    { nombre: "Agua de jamaica", precio: 30, imagen: "agua-jamaica.jpg" },
    { nombre: "Refresco", precio: 25, imagen: "refresco.jpg" },
    { nombre: "Cerveza artesanal", precio: 60, imagen: "cerveza.jpg" }
  ],
  postres: [
    { nombre: "Flan napolitano", precio: 45, imagen: "flan.jpg" },
    { nombre: "Arroz con leche", precio: 40, imagen: "arroz.jpg" },
    { nombre: "Pan dulce", precio: 15, imagen: "pan.jpg" }
  ]
};

let comanda = [];
let estadoComanda = "pendiente";
let nombreMesero = "";
let numeroMesa = "";
let comensales = 1;

function iniciarComanda() {
  nombreMesero = document.getElementById("mesero").value.trim();
  numeroMesa = document.getElementById("mesa").value.trim();

  if (!nombreMesero || !numeroMesa) {
    alert("Por favor ingresa el nombre del mesero y número de mesa.");
    return;
  }

  document.getElementById("pantallaRegistro").classList.add("oculto");
  document.getElementById("pantallaMenu").classList.remove("oculto");
  mostrarCategoria("entradas");
}

function mostrarCategoria(categoria) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  if (!productos[categoria]) return;

  productos[categoria].forEach((producto, index) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="img/${producto.imagen}" alt="${producto.nombre}" />
      <h4>${producto.nombre}</h4>
      <p>$${producto.precio}</p>
      <button onclick="agregarProducto('${categoria}', ${index})">➕ Agregar</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarProducto(categoria, index) {
  const producto = productos[categoria][index];
  comanda.push(producto);
  estadoComanda = "pendiente";
  actualizarResumen();
}

function actualizarResumen() {
  const lista = document.getElementById("listaComanda");
  if (!lista) return;

  lista.innerHTML = "";
  comanda.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
  });
}

function enviarACocina() {
  if (comanda.length === 0) {
    alert("No hay productos en la comanda.");
    return;
  }

  estadoComanda = "en_proceso";
  comensales = parseInt(document.getElementById("comensales").value) || 1;

  const pantallaMenu = document.getElementById("pantallaMenu");
  const pantallaCocina = document.getElementById("pantallaCocina");

  if (pantallaMenu && pantallaCocina) {
    pantallaMenu.classList.add("oculto");
    pantallaCocina.classList.remove("oculto");
  }
}

function mostrarPantallaPago() {
  const pantallaMenu = document.getElementById("pantallaMenu");
  const pantallaCocina = document.getElementById("pantallaCocina");
  const pantallaPago = document.getElementById("pantallaPago");

  if (pantallaMenu) pantallaMenu.classList.add("oculto");
  if (pantallaCocina) pantallaCocina.classList.add("oculto");
  if (pantallaPago) pantallaPago.classList.remove("oculto");

  const total = comanda.reduce((sum, item) => sum + item.precio, 0);
  document.getElementById("totalPago").textContent = total;
  document.getElementById("divisionPago").textContent = (total / comensales).toFixed(2);
}

function imprimirTicket() {
  const total = comanda.reduce((sum, item) => sum + item.precio, 0);
  const resumen = comanda.map(item => `<li>${item.nombre} - $${item.precio}</li>`).join('');
  const fecha = new Date().toLocaleString();

  const ticketHTML = `
    <div style="background:#fff8e1; padding:20px; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <h3>🧾 Ticket de Consumo</h3>
      <p><strong>Mesero:</strong> ${nombreMesero}</p>
      <p><strong>Mesa:</strong> ${numeroMesa}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <ul style="padding-left: 20px;">${resumen}</ul>
      <p><strong>Total:</strong> $${total}</p>
      <p style="margin-top:10px;">Gracias por tu visita 🙌</p>
    </div>
  `;

  const ticketContainer = document.getElementById("ticketVisual");
  if (ticketContainer) {
    ticketContainer.innerHTML = ticketHTML;
  }
}
