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

  productos[categoria]?.forEach((producto, index) => {
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
  comanda.push({
    id: Date.now(),
    nombre: producto.nombre,
    precio: producto.precio,
    detalle: ""
  });
  estadoComanda = "pendiente";
  actualizarResumen();
  calcularPago();
}

function actualizarResumen() {
  const lista = document.getElementById("listaComanda");
  if (!lista) return;

  lista.innerHTML = comanda.map(item => `
    <li>
      ${item.nombre} - $${item.precio}
      <input type="text" placeholder="Detalles" value="${item.detalle}" onchange="actualizarDetalle(${item.id}, this.value)" />
      <button onclick="eliminarProducto(${item.id})">🗑️</button>
    </li>
  `).join('');
}

function actualizarDetalle(id, texto) {
  const producto = comanda.find(item => item.id === id);
  if (producto) producto.detalle = texto;
}

function eliminarProducto(id) {
  comanda = comanda.filter(item => item.id !== id);
  actualizarResumen();
  calcularPago();
}

function enviarACocina() {
  if (comanda.length === 0) {
    alert("No hay productos en la comanda.");
    return;
  }

  estadoComanda = "en_proceso";
  comensales = parseInt(document.getElementById("comensales").value) || 1;

  document.getElementById("pantallaMenu").classList.add("oculto");
  document.getElementById("pantallaCocina").classList.remove("oculto");

  const listaCocina = document.getElementById("listaCocina");
  if (listaCocina) {
    listaCocina.innerHTML = comanda.map(item => `
      <li>
        <strong>${item.nombre}</strong> - $${item.precio}
        ${item.detalle ? `<div style="color:#d35400; font-style:italic;">📝 ${item.detalle}</div>` : ""}
      </li>
    `).join('');
  }
}

function mostrarPantallaPago() {
  document.getElementById("pantallaMenu")?.classList.add("oculto");
  document.getElementById("pantallaCocina")?.classList.add("oculto");
  document.getElementById("pantallaPago")?.classList.remove("oculto");

  const total = comanda.reduce((sum, item) => sum + item.precio, 0);
  const porPersona = comensales > 0 ? (total / comensales) : total;

  document.getElementById("totalPago").textContent = `$${total}`;
  document.getElementById("divisionPago").textContent = `$${porPersona.toFixed(2)}`;

  document.getElementById("listaPago").innerHTML = comanda.map(item =>
    `<li>${item.nombre} - $${item.precio}${item.detalle ? ` <em>(${item.detalle})</em>` : ""}</li>`
  ).join('');

  document.getElementById("metodosPago").innerHTML = `
    <button onclick="enviarTicket('Efectivo')">💵 Efectivo</button>
    <button onclick="enviarTicket('Tarjeta')">💳 Tarjeta</button>
    <button onclick="enviarTicket('Transferencia')">📲 Transferencia</button>
  `;
}

function enviarTicket(metodo) {
  const total = comanda.reduce((sum, item) => sum + item.precio, 0);
  const resumen = comanda.map(item =>
    `<li>${item.nombre} - $${item.precio}${item.detalle ? ` <em>(${item.detalle})</em>` : ""}</li>`
  ).join('');
  const fecha = new Date().toLocaleString();

  const ticketHTML = `
    <div style="background:#fff8e1; padding:20px; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <h3>🧾 Ticket de Consumo</h3>
      <p><strong>Mesero:</strong> ${nombreMesero}</p>
      <p><strong>Mesa:</strong> ${numeroMesa}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Método de pago:</strong> ${metodo}</p>
      <ul style="padding-left: 20px;">${resumen}</ul>
      <p><strong>Total:</strong> $${total}</p>
      <p style="margin-top:10px;">Gracias por tu visita 🙌</p>
    </div>
  `;

  document.getElementById("ticketVisual").innerHTML = ticketHTML;
  console.log(`🎟️ Ticket generado con método de pago: ${metodo}`);
}

function marcarComoEntregado() {
  estadoComanda = "entregado";
  document.getElementById("estadoEntrega").innerHTML = `
    <p style="color:#27ae60; font-weight:bold;">🟢 Pedido entregado en mesa</p>
  `;
}

function calcularPago() {
  const total = comanda.reduce((sum, item) => sum + item.precio, 0);
  const porPersona = comensales > 0 ? (total / comensales) : total;

  document.getElementById("totalPago").textContent = `$${total}`;
  document.getElementById("divisionPago").textContent = `$${porPersona.toFixed(2)}`;
}

function reiniciarComanda() {
  document.getElementById("pantallaRegistro")?.classList.remove("oculto");
  document.getElementById("pantallaPago")?.classList.add("oculto");
  document.getElementById("pantallaCocina")?.classList.add("oculto");
  document.getElementById("pantallaMenu")?.classList.add("oculto");

  comanda = [];
  estadoComanda = "pendiente";
  comensales = 1;

  document.getElementById("ticketVisual").innerHTML = "";
  document.getElementById("listaComanda").innerHTML = "";
  document.getElementById("estadoEntrega").innerHTML = "";
  document.getElementById("listaCocina").innerHTML = "";
  const totalPago = document.getElementById("totalPago");
if (totalPago) totalPago.textContent = "$0";}