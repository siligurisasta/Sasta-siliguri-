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

/**************** FORM ELEMENTS ****************/
const pnameEl = document.getElementById("pname");
const priceEl = document.getElementById("price");
const mrpEl   = document.getElementById("mrp");
const minEl   = document.getElementById("min");
const unitEl  = document.getElementById("unit");
const imgEl   = document.getElementById("img");
const stockEl = document.getElementById("stock");

/**************** PRODUCTS ****************/
const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

let products = JSON.parse(localStorage.getItem("sasta_products")) || [];
let editIndex = -1;

/**************** CART ****************/
let cart = JSON.parse(localStorage.getItem("sasta_cart")) || [];

/**************** SAVE STORAGE ****************/
function saveProducts() {
  localStorage.setItem("sasta_products", JSON.stringify(products));
}
function saveCart() {
  localStorage.setItem("sasta_cart", JSON.stringify(cart));
}

/**************** ADD / UPDATE PRODUCT ****************/
function saveProduct() {
  const pname = pnameEl.value.trim();
  const price = Number(priceEl.value);
  const mrp = mrpEl.value;
  const min = minEl.value;
  const unit = unitEl.value;
  const stock = stockEl.checked;

  if (!pname || !price) {
    alert("Product name & price required");
    return;
  }

  if (imgEl.files.length > 0) {
    const reader = new FileReader();
    reader.onload = e => saveFinal(e.target.result);
    reader.readAsDataURL(imgEl.files[0]);
  } else {
    saveFinal("https://via.placeholder.com/300");
  }

  function saveFinal(img) {
    const product = { pname, price, mrp, min, unit, stock, img };

    if (editIndex === -1) products.push(product);
    else products[editIndex] = product;

    editIndex = -1;
    saveProducts();
    renderProducts();
    clearForm();
  }
}

/**************** DELETE PRODUCT ****************/
function deleteProduct() {
  if (editIndex === -1) return alert("Select product first");
  products.splice(editIndex, 1);
  editIndex = -1;
  saveProducts();
  renderProducts();
  clearForm();
}

/**************** CLEAR FORM ****************/
function clearForm() {
  pnameEl.value = "";
  priceEl.value = "";
  mrpEl.value = "";
  minEl.value = "";
  unitEl.value = "";
  imgEl.value = "";
  stockEl.checked = true;
  editIndex = -1;
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
        <p>Minimum: ${p.min || 1} ${p.unit || ""}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
        <button onclick="event.stopPropagation(); addToCart(${i})">Add to Cart</button>
      </div>
    `;
  });
}

/**************** EDIT PRODUCT ****************/
function editProduct(i) {
  const p = products[i];
  editIndex = i;

  pnameEl.value = p.pname;
  priceEl.value = p.price;
  mrpEl.value = p.mrp;
  minEl.value = p.min;
  unitEl.value = p.unit;
  stockEl.checked = p.stock;

  admin.style.display = "block";
  admin.scrollIntoView({ behavior: "smooth" });
}

/**************** ADD TO CART ****************/
function addToCart(i) {
  const p = products[i];
  const found = cart.find(c => c.pname === p.pname);

  if (found) found.qty++;
  else cart.push({ ...p, qty: 1 });

  saveCart();
  updateCartCount();
  openCartPopup();
}

function updateCartCount() {
  cartCount.innerText = cart.reduce((t, i) => t + i.qty, 0);
}

/**************** CART POPUP ****************/
function openCartPopup() {
  closePopup();

  let itemsHTML = "";
  let total = 0;

  cart.forEach((c, i) => {
    total += c.price * c.qty;
    itemsHTML += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0">
        <b>${c.pname}</b>
        <div>
          <button onclick="qty(${i},-1)">−</button>
          <b>${c.qty}</b>
          <button onclick="qty(${i},1)">+</button>
        </div>
      </div>
    `;
  });

  const div = document.createElement("div");
  div.id = "cartPopup";
  div.innerHTML = `
  <div style="position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:9999">
    <div style="background:#fff;border-radius:18px;padding:16px;width:90%;max-width:360px">
      <h3>Your Cart</h3>
      ${itemsHTML}
      <p><b>FREE DELIVERY</b></p>
      <p><b>Total: ₹${total}</b></p>
      <button onclick="sendWA(${total})" style="width:100%">Order on WhatsApp</button>
      <button onclick="closePopup()" style="width:100%;margin-top:6px;background:#ddd;color:#000">Close</button>
    </div>
  </div>`;
  document.body.appendChild(div);
}

function qty(i, v) {
  cart[i].qty += v;
  if (cart[i].qty < 1) cart[i].qty = 1;
  saveCart();
  openCartPopup();
}

function closePopup() {
  const p = document.getElementById("cartPopup");
  if (p) p.remove();
}

/**************** WHATSAPP ****************/
function sendWA(total) {
  const name = document.querySelector('input[placeholder="Full name"]').value;
  const phone = document.querySelector('input[placeholder="Phone number"]').value;
  const address = document.querySelector('textarea').value;

  let items = "";
  cart.forEach(c => {
    items += `• *${c.pname}*  x${c.qty}  ₹${c.price * c.qty}\n`;
  });

  const msg = `*Your details*
*Name:* ${name}
*Phone:* ${phone}
*Address:* ${address}

------------------
*Items*
${items}

------------------
*Total Amount:* ₹${total}

Thank you for choosing *Sasta Siliguri* 🙏`;

  window.open(
    `https://wa.me/917602884208?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

/**************** LOAD ****************/
renderProducts();
updateCartCount();
