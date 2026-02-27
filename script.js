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

/**************** PRODUCTS (LOCAL STORAGE) ****************/
const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

let products = JSON.parse(localStorage.getItem("sasta_products")) || [];
let editIndex = -1;

/**************** CART ****************/
let cart = JSON.parse(localStorage.getItem("sasta_cart")) || {};

function saveCart() {
  localStorage.setItem("sasta_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  let totalQty = 0;
  Object.values(cart).forEach(i => totalQty += i.qty);
  cartCount.innerText = totalQty;
}

/**************** SAVE PRODUCTS ****************/
function saveProducts() {
  localStorage.setItem("sasta_products", JSON.stringify(products));
}

/**************** ADD / UPDATE PRODUCT ****************/
function saveProduct() {
  const pname = pnameEl.value.trim();
  const price = priceEl.value;
  const mrp = mrpEl.value;
  const min = minEl.value;
  const unit = unitEl.value;
  const stock = stockEl.checked;
  const imgInput = imgEl;

  if (!pname || !price) {
    alert("Product name & price required");
    return;
  }

  if (imgInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = e => saveFinal(e.target.result);
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    saveFinal("https://via.placeholder.com/300");
  }

  function saveFinal(imgSrc) {
    const product = { name:pname, price, mrp, min, unit, stock, img:imgSrc };

    if (editIndex === -1) products.push(product);
    else products[editIndex] = product;

    editIndex = -1;
    saveProducts();
    renderProducts();
    clearForm();
  }
}

/**************** DELETE ****************/
function deleteProduct() {
  if (editIndex === -1) return alert("Select product first");
  products.splice(editIndex, 1);
  editIndex = -1;
  saveProducts();
  renderProducts();
  clearForm();
}

/**************** CLEAR ****************/
function clearForm() {
  pnameEl.value = priceEl.value = mrpEl.value = minEl.value = unitEl.value = "";
  imgEl.value = "";
  stockEl.checked = true;
  editIndex = -1;
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
          ${p.mrp ? `<del>₹${p.mrp}</del>` : ""} <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min || 1} ${p.unit || ""}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
        <button onclick="addToCart(${i})">Add to Cart</button>
      </div>
    `;
  });
}

/**************** ADD TO CART ****************/
function addToCart(i) {
  if (!cart[i]) cart[i] = { ...products[i], qty: 1 };
  else cart[i].qty++;
  saveCart();
}

/**************** POPUP CART ****************/
function orderWhatsApp() {
  if (Object.keys(cart).length === 0) {
    alert("Cart empty");
    return;
  }

  let total = 0;
  let itemsHtml = "";

  Object.values(cart).forEach(p => {
    total += p.price * p.qty;
    itemsHtml += `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">
        <img src="${p.img}" style="width:60px;height:60px;border-radius:10px;object-fit:cover">
        <div style="flex:1">
          <b>${p.name}</b><br>
          ₹${p.price} × ${p.qty}
        </div>
      </div>
    `;
  });

  const popup = document.createElement("div");
  popup.style = `
    position:fixed;inset:0;background:rgba(0,0,0,.45);
    display:flex;align-items:center;justify-content:center;z-index:9999;
  `;

  popup.innerHTML = `
    <div style="
      background:#fff;border-radius:20px;padding:16px;
      width:90%;max-width:360px;
      box-shadow:0 20px 50px rgba(0,0,0,.3)">
      <h2>Your Cart</h2>
      ${itemsHtml}
      <h3>Total: ₹${total}</h3>

      <button style="width:100%;margin-top:10px"
        onclick="sendWhatsApp(${total})">Order on WhatsApp</button>
      <button style="width:100%;margin-top:8px;background:#ccc;color:#000"
        onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
  `;

  document.body.appendChild(popup);
}

/**************** SEND TO WHATSAPP ****************/
function sendWhatsApp(total) {
  let msg = "🛒 *Sasta Siliguri Order*%0A%0A";

  Object.values(cart).forEach(p => {
    msg += `• ${p.name} × ${p.qty} = ₹${p.price * p.qty}%0A`;
  });

  msg += `%0A*Total:* ₹${total}`;

  const url = `https://wa.me/917602884208?text=${msg}`;
  window.open(url, "_blank");
}

/**************** INIT ****************/
updateCartCount();
renderProducts();

/**************** INPUT SHORTCUTS ****************/
const pnameEl = document.getElementById("pname");
const priceEl = document.getElementById("price");
const mrpEl = document.getElementById("mrp");
const minEl = document.getElementById("min");
const unitEl = document.getElementById("unit");
const imgEl = document.getElementById("img");
const stockEl = document.getElementById("stock");
