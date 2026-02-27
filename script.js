/**************** ADMIN ACCESS ****************/
const ADMIN_PASS = "1513";
const admin = document.getElementById("admin");
const logo = document.getElementById("logo");

admin.style.display = "none";

let taps = 0;
let tapTimer = null;

logo.addEventListener("click", () => {
  taps++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => taps = 0, 800);

  if (taps === 3) {
    taps = 0;
    const pass = prompt("Enter admin password");
    if (pass === ADMIN_PASS) {
      admin.style.display = "block";
      admin.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Wrong password");
    }
  }
});

/**************** ELEMENTS ****************/
const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

const pname = document.getElementById("pname");
const price = document.getElementById("price");
const mrp = document.getElementById("mrp");
const min = document.getElementById("min");
const unit = document.getElementById("unit");
const img = document.getElementById("img");
const stock = document.getElementById("stock");

/**************** DATA ****************/
let products = JSON.parse(localStorage.getItem("sasta_products")) || [];
let cart = JSON.parse(localStorage.getItem("sasta_cart")) || {};
let editIndex = -1;

/**************** SAVE STORAGE ****************/
function saveProducts() {
  localStorage.setItem("sasta_products", JSON.stringify(products));
}
function saveCart() {
  localStorage.setItem("sasta_cart", JSON.stringify(cart));
  updateCartCount();
}

/**************** ADD / UPDATE PRODUCT ****************/
function saveProduct() {
  if (!pname.value || !price.value) {
    alert("Product name & price required");
    return;
  }

  if (img.files.length > 0) {
    const reader = new FileReader();
    reader.onload = e => finalSave(e.target.result);
    reader.readAsDataURL(img.files[0]);
  } else {
    finalSave("https://via.placeholder.com/300");
  }
}

function finalSave(imgSrc) {
  const product = {
    name: pname.value,
    price: Number(price.value),
    mrp: Number(mrp.value),
    min: min.value,
    unit: unit.value,
    stock: stock.checked,
    img: imgSrc
  };

  if (editIndex === -1) products.push(product);
  else products[editIndex] = product;

  editIndex = -1;
  saveProducts();
  renderProducts();
  clearForm();
}

/**************** DELETE ****************/
function deleteProduct() {
  if (editIndex === -1) {
    alert("Select product first");
    return;
  }
  products.splice(editIndex, 1);
  editIndex = -1;
  saveProducts();
  renderProducts();
  clearForm();
}

/**************** CLEAR ****************/
function clearForm() {
  pname.value = "";
  price.value = "";
  mrp.value = "";
  min.value = "";
  unit.value = "";
  img.value = "";
  stock.checked = true;
}

/**************** RENDER PRODUCTS ****************/
function renderProducts() {
  productsDiv.innerHTML = "";

  products.forEach((p, i) => {
    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <div class="price">
          ${p.mrp ? `<del>₹${p.mrp}</del>` : ""}
          <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min || 1} ${p.unit || ""}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
        <button onclick="addToCart(${i})">Add to Cart</button>
      </div>
    `;
  });
}

/**************** CART ****************/
function addToCart(i) {
  if (!cart[i]) cart[i] = { ...products[i], qty: 1 };
  else cart[i].qty++;

  saveCart();
}

function updateCartCount() {
  let total = 0;
  Object.values(cart).forEach(p => total += p.qty);
  cartCount.innerText = total;
}

/**************** WHATSAPP ****************/
function orderWhatsApp() {
  alert("Popup already working – next step fine 🔥");
}

/**************** INIT ****************/
renderProducts();
updateCartCount();
