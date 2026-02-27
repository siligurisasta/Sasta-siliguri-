/**************** ADMIN ACCESS ****************/
const ADMIN_PASS = "1513";
const admin = document.getElementById("admin");
const logo = document.getElementById("logo");

admin.style.display = "none";

let taps = 0, tapTimer = null;

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
let editIndex = -1;

/**************** CART (MULTI ITEM) ****************/
let cart = JSON.parse(localStorage.getItem("sasta_cart")) || [];

/**************** SAVE ****************/
const saveProducts = () =>
  localStorage.setItem("sasta_products", JSON.stringify(products));

const saveCart = () =>
  localStorage.setItem("sasta_cart", JSON.stringify(cart));

/**************** ADD / UPDATE PRODUCT ****************/
function saveProduct() {
  const pname = pnameEl.value.trim();
  const price = priceEl.value;
  const mrp = mrpEl.value;
  const min = minEl.value;
  const unit = unitEl.value;
  const stock = stockEl.checked;
  const imgInput = imgEl;

  if (!pname || !price) return alert("Product name & price required");

  if (imgInput.files.length > 0) {
    const r = new FileReader();
    r.onload = e => saveFinal(e.target.result);
    r.readAsDataURL(imgInput.files[0]);
  } else {
    saveFinal("https://via.placeholder.com/300");
  }

  function saveFinal(img) {
    const p = { name:pname, price, mrp, min, unit, stock, img };
    if (editIndex === -1) products.push(p);
    else products[editIndex] = p;

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
  products.forEach((p,i)=>{
    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <div class="price">
          ${p.mrp ? `<del>₹${p.mrp}</del>` : ""} <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min||1} ${p.unit||""}</p>
        <p>${p.stock?"In stock ✅":"Out of stock ❌"}</p>
        <button onclick="addToCart(${i})">Add to Cart</button>
      </div>`;
  });
}

/**************** EDIT ****************/
function editProduct(i) {
  const p = products[i];
  editIndex = i;
  pnameEl.value = p.name;
  priceEl.value = p.price;
  mrpEl.value = p.mrp;
  minEl.value = p.min;
  unitEl.value = p.unit;
  stockEl.checked = p.stock;
  admin.style.display="block";
  admin.scrollIntoView({behavior:"smooth"});
}

/**************** CART LOGIC ****************/
function addToCart(i){
  const p = products[i];
  const found = cart.find(c => c.name === p.name);
  if(found) found.qty++;
  else cart.push({ ...p, qty:1 });

  saveCart();
  updateCartCount();
  openCartPopup();
}

function updateCartCount(){
  cartCount.innerText = cart.reduce((s,i)=>s+i.qty,0);
}

/**************** POPUP ****************/
function openCartPopup(){
  closePopup();
  let itemsHTML = "";
  let total = 0;

  cart.forEach((c,i)=>{
    total += c.qty * c.price;
    itemsHTML += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0">
        <b>${c.name}</b>
        <div>
          <button onclick="qty(${i},-1)">−</button>
          <b>${c.qty}</b>
          <button onclick="qty(${i},1)">+</button>
        </div>
      </div>`;
  });

  document.body.insertAdjacentHTML("beforeend",`
  <div id="cartPopup" style="position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:9999">
    <div style="background:#fff;border-radius:18px;padding:16px;width:90%;max-width:360px">
      <h3>Your Cart</h3>
      ${itemsHTML}
      <p><b>FREE DELIVERY</b></p>
      <p><b>Total: ₹${total}</b></p>
      <button style="width:100%" onclick="sendWA()">Order on WhatsApp</button>
      <button style="width:100%;margin-top:6px;background:#ddd;color:#000" onclick="closePopup()">Close</button>
    </div>
  </div>`);
}

function qty(i,v){
  cart[i].qty += v;
  if(cart[i].qty<1) cart[i].qty=1;
  saveCart();
  openCartPopup();
  updateCartCount();
}

function closePopup(){
  const p=document.getElementById("cartPopup");
  if(p) p.remove();
}

/**************** WHATSAPP ****************/
function sendWA(){
  const name=document.querySelector('input[placeholder="Full name"]').value;
  const phone=document.querySelector('input[placeholder="Phone number"]').value;
  const address=document.querySelector('textarea').value;

  let text=`*Your details*\nName: *${name}*\nPhone: *${phone}*\nAddress: *${address}*\n\n------------------\n*Items*\n`;
  let total=0;

  cart.forEach(c=>{
    text+=`*${c.name}*  x${c.qty}  ₹${c.price}\n`;
    total+=c.qty*c.price;
  });

  text+=`\n------------------\n*Total Amount: ₹${total}*\n\nThank you for choosing *Sasta Siliguri* 🙏`;

  window.open(`https://wa.me/917602884208?text=${encodeURIComponent(text)}`,"_blank");
}

/**************** INIT ****************/
renderProducts();
updateCartCount();
