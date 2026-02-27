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

/**************** STORAGE ****************/
let products = JSON.parse(localStorage.getItem("sasta_products")) || [];
let cart = JSON.parse(localStorage.getItem("sasta_cart")) || [];
let editIndex = -1;

const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

/**************** SAVE ****************/
function saveProducts() {
  localStorage.setItem("sasta_products", JSON.stringify(products));
}
function saveCart() {
  localStorage.setItem("sasta_cart", JSON.stringify(cart));
}

/**************** ADMIN: SAVE / UPDATE ****************/
function saveProduct() {
  const pname = document.getElementById("pname").value.trim();
  const price = +document.getElementById("price").value;
  const mrp = +document.getElementById("mrp").value;
  const min = +document.getElementById("min").value || 1;
  const unit = document.getElementById("unit").value;
  const stock = document.getElementById("stock").checked;
  const imgInput = document.getElementById("img");

  if (!pname || !price) {
    alert("Name & price required");
    return;
  }

  if (imgInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = e => finalize(e.target.result);
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    finalize(editIndex >= 0 ? products[editIndex].img : "https://via.placeholder.com/300");
  }

  function finalize(img) {
    const product = { pname, price, mrp, min, unit, stock, img };

    if (editIndex >= 0) products[editIndex] = product;
    else products.push(product);

    editIndex = -1;
    saveProducts();
    renderProducts();
    clearForm();
  }
}

function deleteProduct() {
  if (editIndex < 0) return alert("Select product first");
  products.splice(editIndex, 1);
  editIndex = -1;
  saveProducts();
  renderProducts();
  clearForm();
}

function clearForm() {
  pname.value = price.value = mrp.value = min.value = unit.value = "";
  img.value = "";
  stock.checked = true;
}

/**************** RENDER PRODUCTS ****************/
function renderProducts() {
  productsDiv.innerHTML = "";

  products.forEach((p, i) => {
    productsDiv.innerHTML += `
      <div class="product" onclick="editProduct(${i})">
        <img src="${p.img}">
        <h3>${p.pname}</h3>
        <div class="price">
          ${p.mrp ? `<del>₹${p.mrp}</del>` : ""}
          <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min} ${p.unit}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
        <button onclick="event.stopPropagation(); addToCart(${i})">
          Add to Cart
        </button>
      </div>
    `;
  });
}

/**************** EDIT PRODUCT ****************/
function editProduct(i) {
  const p = products[i];
  editIndex = i;

  pname.value = p.pname;
  price.value = p.price;
  mrp.value = p.mrp;
  min.value = p.min;
  unit.value = p.unit;
  stock.checked = p.stock;

  admin.style.display = "block";
  admin.scrollIntoView({ behavior: "smooth" });
}

/**************** CART ****************/
function addToCart(i) {
  const found = cart.find(c => c.i === i);
  if (found) found.qty++;
  else cart.push({ i, qty: 1 });

  saveCart();
  updateCartCount();
}

function updateCartCount() {
  cartCount.innerText = cart.reduce((a, b) => a + b.qty, 0);
}

/**************** CART POPUP ****************/
function orderWhatsApp() {
  if (!cart.length) return alert("Cart empty");

  closePopup();

  let total = 0;
  let itemsHtml = "";

  cart.forEach((c, idx) => {
    const p = products[c.i];
    const line = p.price * c.qty;
    total += line;

    itemsHtml += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0">
        <b>${p.pname}</b>
        <div>
          <button onclick="changeQty(${idx},-1)">−</button>
          ${c.qty}
          <button onclick="changeQty(${idx},1)">+</button>
        </div>
      </div>
    `;
  });

  const pop = document.createElement("div");
  pop.id = "cartPopup";
  pop.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:9999">
      <div style="background:#fff;border-radius:18px;padding:16px;width:90%;max-width:360px">
        <h3>🛒 Your Cart</h3>
        ${itemsHtml}
        <p><b>FREE DELIVERY</b></p>
        <h3>Total: ₹${total}</h3>
        <button onclick="sendWA()">Order on WhatsApp</button>
        <button onclick="closePopup()" style="background:#ddd;color:#000;margin-top:6px">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(pop);
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty < 1) cart[i].qty = 1;
  saveCart();
  orderWhatsApp();
}

function closePopup() {
  const p = document.getElementById("cartPopup");
  if (p) p.remove();
}

/**************** WHATSAPP ****************/
function sendWA() {
  const name = document.querySelector('input[placeholder="Full name"]').value;
  const phone = document.querySelector('input[placeholder="Phone number"]').value;
  const address = document.querySelector('textarea').value;

  let msg = `*SASTA SILIGURI*\n\n*Your Details*\nName: *${name}*\nPhone: *${phone}*\nAddress: *${address}*\n\n------------------\n`;

  let total = 0;
  cart.forEach(c => {
    const p = products[c.i];
    total += p.price * c.qty;
    msg += `*${p.pname}* × ${c.qty} = ₹${p.price * c.qty}\n`;
  });

  msg += `------------------\n*Total Amount: ₹${total}*\n\nThank you for choosing *Sasta Siliguri* 🙏`;

  window.open(
    `https://wa.me/917602884208?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

/**************** INIT ****************/
renderProducts();
updateCartCount();
