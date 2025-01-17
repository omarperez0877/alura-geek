const form = document.getElementById('product-form');
const productsList = document.getElementById('products-list');
const searchInput = document.getElementById('search');
const apiUrl = 'https://alura-geek-crb7.onrender.com/products';

// Mostrar spinner mientras se cargan los productos
const spinner = document.createElement('div');
spinner.className = 'spinner';
document.body.appendChild(spinner);

// Variable para rastrear el producto en edición
let editingProductId = null;

// Función para obtener y renderizar productos
const fetchProducts = async (filter = '') => {
  spinner.style.display = 'block';
  try {
    const response = await fetch(apiUrl);
    let products = await response.json();
    spinner.style.display = 'none';

    // Filtrar productos según el término de búsqueda
    if (filter) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    productsList.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button class="delete-btn">Eliminar</button>
        <button class="edit-btn">Editar</button>
      </div>
    `).join('');
    // Aplicar efecto de entrada
    document.querySelectorAll('.product-card').forEach(card => {
      setTimeout(() => {
        card.classList.add('visible');
      }, 100);
    });
  } catch (error) {
    spinner.style.display = 'none';
    console.error('Error fetching products:', error);
  }
};

// Función para manejar eventos de búsqueda
searchInput.addEventListener('input', (e) => {
  const filter = e.target.value.trim();
  fetchProducts(filter);
});

// Función para agregar o actualizar un producto
const saveProduct = async (product) => {
  try {
    if (editingProductId) {
      // Actualizar producto existente
      await fetch(`${apiUrl}/${editingProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } else {
      // Agregar nuevo producto
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    }
    resetForm();
    fetchProducts();
  } catch (error) {
    console.error('Error saving product:', error);
  }
};

// Función para eliminar un producto
const deleteProduct = async (id) => {
  try {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchProducts();
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

// Función para cargar datos de un producto al formulario para editar
const loadProductToEdit = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    const product = await response.json();

    // Llenar el formulario con los datos del producto
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('image').value = product.image;

    // Establecer el producto en edición
    editingProductId = id;
    document.getElementById('submit-btn').textContent = 'Actualizar Producto';
  } catch (error) {
    console.error('Error loading product to edit:', error);
  }
};

// Función para restablecer el formulario
const resetForm = () => {
  form.reset();
  editingProductId = null;
  document.getElementById('submit-btn').textContent = 'Agregar Producto';
};

// Manejo del envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const image = document.getElementById('image').value.trim();

  // Validaciones
  if (!name || name.length < 3) {
    alert('El nombre del producto debe tener al menos 3 caracteres.');
    return;
  }
  if (isNaN(price) || price <= 0) {
    alert('El precio debe ser un número válido mayor que 0.');
    return;
  }
  if (!image || !image.startsWith('http')) {
    alert('La URL de la imagen debe ser válida.');
    return;
  }

  // Guardar o actualizar el producto
  saveProduct({ name, price, image });
});
    
// Manejo de eventos en la lista de productos
productsList.addEventListener('click', (e) => {
  const productCard = e.target.closest('.product-card');
  if (!productCard) return; // No hacer nada si no es un elemento válido

  const productId = productCard.getAttribute('data-id');

  if (e.target.classList.contains('delete-btn')) {
    deleteProduct(productId);
  }

  if (e.target.classList.contains('edit-btn')) {
    loadProductToEdit(productId);
  }
});

// Inicialización
fetchProducts();
