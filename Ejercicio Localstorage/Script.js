const form = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const quantityInput = document.getElementById('quantity');
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');


function getProducts() {
  return JSON.parse(localStorage.getItem('products')) || [];
}


function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}


function displayProducts(filter = '') {
  const products = getProducts();
  productList.innerHTML = '';

  products.forEach((product, index) => {
    if (product.name.toLowerCase().includes(filter.toLowerCase())) {
      productList.innerHTML += `
        <tr id="row-${index}">
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${product.quantity}</td>
          <td>
            <button onclick="startEdit(${index})">Editar</button>
            <button onclick="deleteProduct(${index})">Eliminar</button>
          </td>
        </tr>
      `;
    }
  });
}


form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = nameInput.value;
  const price = priceInput.value;
  const quantity = quantityInput.value;

  const products = getProducts();
  products.push({ name, price, quantity });

  saveProducts(products);
  displayProducts();
  form.reset();
});


function deleteProduct(index) {
  const products = getProducts();
  products.splice(index, 1);
  saveProducts(products);
  displayProducts(searchInput.value); 
}


function startEdit(index) {
  const products = getProducts();
  const row = document.getElementById(`row-${index}`);
  const product = products[index];

  row.innerHTML = `
    <td><input type="text" id="edit-name-${index}" value="${product.name}"></td>
    <td><input type="number" id="edit-price-${index}" value="${product.price}"></td>
    <td><input type="number" id="edit-quantity-${index}" value="${product.quantity}"></td>
    <td>
      <button onclick="saveEdit(${index})">Guardar</button>
      <button onclick="displayProducts('${searchInput.value}')">Cancelar</button>
    </td>
  `;
}


function saveEdit(index) {
  const products = getProducts();

  const name = document.getElementById(`edit-name-${index}`).value;
  const price = document.getElementById(`edit-price-${index}`).value;
  const quantity = document.getElementById(`edit-quantity-${index}`).value;

  products[index] = { name, price, quantity };
  saveProducts(products);
  displayProducts(searchInput.value);
}

searchInput.addEventListener('input', function () {
  const searchTerm = searchInput.value;
  displayProducts(searchTerm);
});


displayProducts();

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const products = getProducts();

  const tableData = products.map(product => [
    product.name,
    product.price,
    product.quantity
  ]);

  doc.text("Listado de Productos", 14, 10);
  doc.autoTable({
    head: [["Nombre", "Precio", "Cantidad"]],
    body: tableData,
    startY: 20
  });

  doc.save("productos.pdf");
}
