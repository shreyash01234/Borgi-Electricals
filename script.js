// ======== LOCAL STORAGE KEYS ========
const EMP_KEY = 'borgiEmployees';
const PROD_KEY = 'borgiProducts';
const CART_KEY = 'borgiCart';

// ======== INITIAL DATA ========
// If no employees, add an admin employee
if (!localStorage.getItem(EMP_KEY)) {
    const admin = [{
        email: 'admin@borgi.com',
        empID: 'EMP001',
        password: 'admin123'
    }];
    localStorage.setItem(EMP_KEY, JSON.stringify(admin));
}

// ======== SHOW SECTIONS ========
function showCustomerStore(){
    document.getElementById('customer-store').classList.remove('hidden');
    document.getElementById('employee-login').classList.add('hidden');
    document.getElementById('employee-dashboard').classList.add('hidden');
    displayProducts();
}

function showEmployeeLogin(){
    document.getElementById('employee-login').classList.remove('hidden');
    document.getElementById('customer-store').classList.add('hidden');
    document.getElementById('employee-dashboard').classList.add('hidden');
}

// ======== EMPLOYEE LOGIN ========
function employeeLogin(){
    const email = document.getElementById('empEmail').value;
    const empID = document.getElementById('empID').value;
    const password = document.getElementById('empPassword').value;
    const employees = JSON.parse(localStorage.getItem(EMP_KEY)) || [];

    const emp = employees.find(e => e.email === email && e.empID === empID && e.password === password);

    if(emp){
        localStorage.setItem('currentEmp', JSON.stringify(emp));
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
}

// ======== DASHBOARD ========
function showDashboard(){
    document.getElementById('employee-dashboard').classList.remove('hidden');
    document.getElementById('employee-login').classList.add('hidden');
    document.getElementById('customer-store').classList.add('hidden');
    displayDashboardProducts();
}

function logout(){
    localStorage.removeItem('currentEmp');
    showEmployeeLogin();
}

// ======== PRODUCTS ========
function addProduct(){
    const name = document.getElementById('prodName').value;
    const category = document.getElementById('prodCategory').value;
    const features = document.getElementById('prodFeatures').value;
    const price = document.getElementById('prodPrice').value;
    const file = document.getElementById('prodImage').files[0];

    if(!name || !category || !features || !price || !file){
        alert('Fill all fields!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e){
        const products = JSON.parse(localStorage.getItem(PROD_KEY)) || [];
        products.push({
            name,
            category,
            features,
            price,
            image: e.target.result
        });
        localStorage.setItem(PROD_KEY, JSON.stringify(products));
        alert('Product added!');
        displayDashboardProducts();
        displayProducts();
    }
    reader.readAsDataURL(file);
}

function displayProducts(){
    const products = JSON.parse(localStorage.getItem(PROD_KEY)) || [];
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    products.forEach((p, idx) => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${p.image}">
            <h4>${p.name}</h4>
            <p><b>Category:</b> ${p.category}</p>
            <p><b>Features:</b> ${p.features}</p>
            <p><b>Price:</b> ₹${p.price}</p>
            <button onclick="addToCart(${idx})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

function displayDashboardProducts(){
    const products = JSON.parse(localStorage.getItem(PROD_KEY)) || [];
    const container = document.getElementById('dashboard-products');
    container.innerHTML = '';

    products.forEach((p, idx) => {
        const card = document.createElement('div');
        card.classList.add('dashboard-card');
        card.innerHTML = `
            <img src="${p.image}">
            <h4>${p.name}</h4>
            <p><b>Category:</b> ${p.category}</p>
            <p><b>Features:</b> ${p.features}</p>
            <p><b>Price:</b> ₹${p.price}</p>
            <button onclick="deleteProduct(${idx})">Delete</button>
        `;
        container.appendChild(card);
    });
}

function deleteProduct(idx){
    const products = JSON.parse(localStorage.getItem(PROD_KEY)) || [];
    products.splice(idx,1);
    localStorage.setItem(PROD_KEY, JSON.stringify(products));
    displayDashboardProducts();
    displayProducts();
}

// ======== CART ========
function addToCart(idx){
    const products = JSON.parse(localStorage.getItem(PROD_KEY)) || [];
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    cart.push(products[idx]);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    alert('Added to cart!');
    displayCart();
}

function displayCart(){
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const container = document.getElementById('cart-list');
    container.innerHTML = '';
    cart.forEach((p, idx) => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
        `;
        container.appendChild(div);
    });
}

function checkout(){
    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    if(cart.length === 0){
        alert('Cart is empty!');
        return;
    }
    alert('Order placed successfully! Total ₹' + cart.reduce((a,b)=>a+Number(b.price),0));
    localStorage.removeItem(CART_KEY);
    displayCart();
}

// ======== SEARCH ========
function searchProducts(){
    const input = document.getElementById('searchInput').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem(PROD_KEY)) || [];
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    products.filter(p => p.name.toLowerCase().includes(input) || p.category.toLowerCase().includes(input))
    .forEach((p, idx)=>{
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${p.image}">
            <h4>${p.name}</h4>
            <p><b>Category:</b> ${p.category}</p>
            <p><b>Features:</b> ${p.features}</p>
            <p><b>Price:</b> ₹${p.price}</p>
            <button onclick="addToCart(${idx})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

// Show cart on load
displayCart();
