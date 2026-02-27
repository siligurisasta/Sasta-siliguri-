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

/**************** PRODUCTS ****************/
const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

let products = JSON.parse(localStorage.getItem("sasta_products")) || [];
let cartItems = JSON.parse(localStorage.getItem("sasta_cart")) || {};
let editIndex = -1;

/**************** STORAGE ****************/
function saveProducts() {
  localStorage.setItem("sasta_products", JSON.stringify(products));
}
function saveCart() {
  localStorage.setItem("sasta_cart", JSON.stringify(cartItems));
  cartCount.innerText = Object.values(cartItems).reduce((a,b)=>a+b.qty,0);
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
  products.splice(editIndex,1);
  editIndex = -1;
  saveProducts();
  renderProducts();
  clearForm();
}

/**************** CLEAR FORM ****************/
function clearForm() {
  pnameEl.value = priceEl.value = mrpEl.value = minEl.value = unitEl.value = "";
  imgEl.value = "";
  stockEl.checked = true;
}

/**************** RENDER ****************/
function renderProducts() {
  productsDiv.innerHTML = "";
  products.forEach((p,i)=>{
    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <div class="price">
          ${p.mrp?`<del>₹${p.mrp}</del>`:""} <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min||1} ${p.unit||""}</p>
        <p>${p.stock?"In stock ✅":"Out of stock ❌"}</p>
        <button onclick="addToCart(${i})">Add to Cart</button>
      </div>`;
  });
}

/**************** CART ****************/
function addToCart(i){
  if(!cartItems[i]) cartItems[i]={...products[i], qty:1};
  else cartItems[i].qty++;
  saveCart();
}

/**************** POPUP ****************/
function orderWhatsApp(){
  let html = `<div id="popup" style="
    position:fixed; inset:0; background:rgba(0,0,0,.5);
    display:flex; justify-content:center; align-items:center; z-index:999;">
    <div style="background:#fff; width:90%; max-width:400px; border-radius:16px; padding:16px; max-height:90%; overflow:auto">
    <h3>Your Cart</h3>`;

  let total = 0;
  Object.keys(cartItems).forEach(i=>{
    const p = cartItems[i];
    total += p.price * p.qty;
    html += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0">
        <span>${p.name}</span>
        <div>
          <button onclick="changeQty(${i},-1)">-</button>
          ${p.qty}
          <button onclick="changeQty(${i},1)">+</button>
        </div>
      </div>`;
  });

  html += `
    <p><b>Total: ₹${total}</b></p>
    <input id="cname" placeholder="Name" style="width:100%;margin:6px 0">
    <input id="cphone" placeholder="Phone" style="width:100%;margin:6px 0">
    <textarea id="caddr" placeholder="Address" style="width:100%;margin:6px 0"></textarea>
    <button onclick="sendWA(${total})" style="width:100%;margin-top:8px">Order on WhatsApp</button>
    <button onclick="closePopup()" style="width:100%;margin-top:6px">Close</button>
    </div></div>`;

  document.body.insertAdjacentHTML("beforeend",html);
}

function changeQty(i,d){
  cartItems[i].qty+=d;
  if(cartItems[i].qty<=0) delete cartItems[i];
  saveCart();
  closePopup();
  orderWhatsApp();
}

function closePopup(){
  document.getElementById("popup")?.remove();
}

function sendWA(total){
  let msg="Order:%0A";
  Object.values(cartItems).forEach(p=>{
    msg+=`${p.name} x ${p.qty} = ₹${p.qty*p.price}%0A`;
  });
  msg+=`Total ₹${total}`;
  window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`);
}

/**************** ELEMENT SHORTCUTS ****************/
const pnameEl = document.getElementById("pname");
const priceEl = document.getElementById("price");
const mrpEl = document.getElementById("mrp");
const minEl = document.getElementById("min");
const unitEl = document.getElementById("unit");
const imgEl = document.getElementById("img");
const stockEl = document.getElementById("stock");

/**************** LOAD ****************/
renderProducts();
saveCart();
