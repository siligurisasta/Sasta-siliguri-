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
  tapTimer = setTimeout(() => (taps = 0), 800);

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

/**************** PRODUCTS ****************/
const productsDiv = document.getElementById("products");

let products = JSON.parse(localStorage.getItem("sasta_products")) || [];
let editIndex = -1;

function saveProducts() {
  localStorage.setItem("sasta_products", JSON.stringify(products));
}

/**************** ADD / UPDATE PRODUCT ****************/
function saveProduct() {
  const pname = document.getElementById("pname").value.trim();
  const price = document.getElementById("price").value;
  const mrp = document.getElementById("mrp").value;
  const min = document.getElementById("min").value;
  const unit = document.getElementById("unit").value;
  const stock = document.getElementById("stock").checked;
  const imgInput = document.getElementById("img");

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

  function saveFinal(img) {
    const product = { name: pname, price, mrp, min, unit, stock, img };

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

/**************** CLEAR FORM ****************/
function clearForm() {
  pname.value = "";
  price.value = "";
  mrp.value = "";
  min.value = "";
  unit.value = "";
  img.value = "";
  stock.checked = true;
  editIndex = -1;
}

/**************** RENDER PRODUCTS ****************/
function renderProducts() {
  productsDiv.innerHTML = "";

  products.forEach((p, i) => {
    productsDiv.innerHTML += `
      <div class="product" onclick="editProduct(${i})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <div class="price">
          ${p.mrp ? `<del>₹${p.mrp}</del>` : ""}
          <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min || 1} ${p.unit || ""}</p>
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

  pname.value = p.name;
  price.value = p.price;
  mrp.value = p.mrp;
  min.value = p.min;
  unit.value = p.unit;
  stock.checked = p.stock;

  admin.style.display = "block";
  admin.scrollIntoView({ behavior: "smooth" });
}

/**************** CART ****************/
let cart = JSON.parse(localStorage.getItem("sasta_cart")) || {};
const cartCount = document.getElementById("cartCount");

function updateCartCount() {
  let total = 0;
  Object.values(cart).forEach(i => (total += i.qty));
  cartCount.innerText = total;
  localStorage.setItem("sasta_cart", JSON.stringify(cart));
}

function addToCart(i) {
  const p = products[i];
  if (!cart[p.name]) {
    cart[p.name] = { name: p.name, price: p.price, qty: 1 };
  } else {
    cart[p.name].qty++;
  }
  updateCartCount();
}

/**************** CART POPUP ****************/
function openCartPopup() {
  if (Object.keys(cart).length === 0) {
    alert("Cart is empty");
    return;
  }

  const name = document.querySelector('input[placeholder="Full name"]').value.trim();
  const phone = document.querySelector('input[placeholder="Phone number"]').value.trim();
  const address = document.querySelector('textarea').value.trim();

  if (!name || !phone || !address) {
    alert("First fill Name, Phone & Address");
    return;
  }

  closePopup();

  let itemsHTML = "";
  let total = 0;

  Object.values(cart).forEach(item => {
    total += item.qty * item.price;
    itemsHTML += `
      <div style="display:flex;justify-content:space-between;margin:6px 0">
        <b>${item.name}</b>
        <span>
          <button onclick="changeQty('${item.name}',-1)">−</button>
          ${item.qty}
          <button onclick="changeQty('${item.name}',1)">+</button>
        </span>
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

      <button style="width:100%" onclick="sendWA()">Order on WhatsApp</button>
      <button style="width:100%;margin-top:6px;background:#ddd;color:#000" onclick="closePopup()">Close</button>
    </div>
  </div>`;
  document.body.appendChild(div);
}

function changeQty(name, v) {
  cart[name].qty += v;
  if (cart[name].qty <= 0) delete cart[name];
  updateCartCount();
  openCartPopup();
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

  let msg = `*Your details*\n`;
  msg += `Name: *${name}*\nPhone: *${phone}*\nAddress: *${address}*\n\n`;
  msg += `------------------\n*Items*\n`;

  let total = 0;
  Object.values(cart).forEach(i => {
    total += i.qty * i.price;
    msg += `*${i.name}*  x${i.qty}  ₹${i.price}\n`;
  });

  msg += `------------------\n*Total Amount: ₹${total}*\n\n`;
  msg += `Thank you for choosing *Sasta Siliguri* 🙏`;

  window.open(
    `https://wa.me/917602884208?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

/**************** LOAD ****************/
renderProducts();
updateCartCount();
