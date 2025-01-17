// Elements
const cartItemsContainer = document.querySelector('.cart-items');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const checkoutButton = document.getElementById('checkout-btn');
let cartData = null; // To store fetched cart data

// Fetch cart data from the URL
async function fetchCartData() {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
        if (!response.ok) throw new Error('Failed to fetch cart data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cart data:', error);
        alert('Failed to load cart data. Please try again later.');
        return null;
    }
}

// Populate cart items
function populateCart() {
    if (!cartData) return; // Exit if no data

    cartItemsContainer.innerHTML = ''; // Clear existing items

    const table = document.createElement('table');
    table.classList.add('cart-table');

    // Create table header
    const tableHeader = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
            </tr>
        </thead>
    `;
    table.innerHTML = tableHeader;

    // Create table body
    const tableBody = document.createElement('tbody');

    cartData.items.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('cart-item-row');

        row.innerHTML = `
            <td>
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image" style="width: 50px; height: auto; margin-right: 10px;">
                    ${item.title}
                </div>
            </td>
            <td>Rs. ${item.price.toLocaleString()}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" class="cart-item-quantity" data-id="${item.id}" style="width: 60px;">
            </td>
            <td class="cart-item-subtotal">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
            <td>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    cartItemsContainer.appendChild(table);

    updateTotals();
}

// Update totals
function updateTotals() {
    if (!cartData) return; // Exit if no data

    let subtotal = 0;

    cartData.items.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    subtotalElement.textContent = `Rs. ${subtotal.toLocaleString()}`;
    totalElement.textContent = `Rs. ${subtotal.toLocaleString()}`;
}

// Event listeners
cartItemsContainer.addEventListener('input', (e) => {
    if (e.target.classList.contains('cart-item-quantity')) {
        const itemId = e.target.dataset.id;
        const newQuantity = parseInt(e.target.value);

        const item = cartData.items.find(item => item.id == itemId);
        if (item) {
            item.quantity = newQuantity; // Update quantity in cartData
            const subtotalElement = e.target.closest('tr').querySelector('.cart-item-subtotal');
            subtotalElement.textContent = `Rs. ${(item.price * item.quantity).toLocaleString()}`; // Update row subtotal
            updateTotals(); // Recalculate totals
        }
    }
});

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        const itemId = e.target.dataset.id;

        cartData.items = cartData.items.filter(item => item.id != itemId);
        populateCart();
    }
});

checkoutButton.addEventListener('click', () => {
    alert('Proceeding to checkout!');
});

// Initialize cart by fetching data
(async function initializeCart() {
    cartData = await fetchCartData();
    if (cartData) populateCart();
})();
