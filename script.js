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
let cart = JSON.parse(localStorage.getItem("sasta_cart")) || [];
let editIndex = -1;

/* SAVE */
function saveProducts() {
  localStorage.setItem("sasta_products", JSON.stringify(products));
}
function saveCart() {
  localStorage.setItem("sasta_cart", JSON.stringify(cart));
}

/**************** ADD / UPDATE PRODUCT ****************/
function saveProduct() {
  const pname = document.getElementById("pname").value.trim();
  const price = document.getElementById("price").value;
  const mrp = document.getElementById("mrp").value;
  const min = document.getElementById("min").value || 1;
  const unit = document.getElementById("unit").value || "";
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
    saveFinal(editIndex >= 0 ? products[editIndex].img : "https://via.placeholder.com/300");
  }

  function saveFinal(img) {
    const product = { name:pname, price:+price, mrp:+mrp, min:+min, unit, stock, img };

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
  products.splice(editIndex,1);
  editIndex = -1;
  saveProducts();
  renderProducts();
  clearForm();
}

/**************** CLEAR FORM ****************/
function clearForm() {
  pname.value = price.value = mrp.value = min.value = unit.value = "";
  img.value = "";
  stock.checked = true;
  editIndex = -1;
}

/**************** RENDER PRODUCTS ****************/
function renderProducts() {
  productsDiv.innerHTML = "";

  products.forEach((p,i)=>{
    productsDiv.innerHTML += `
      <div class="product" onclick="editProduct(${i})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <div class="price">
          ${p.mrp ? `<del>₹${p.mrp}</del>` : ""}
          <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min} ${p.unit}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
        <button onclick="event.stopPropagation(); addToCart(${i})">Add to Cart</button>
      </div>
    `;
  });

  cartCount.innerText = cart.reduce((a,b)=>a+b.qty,0);
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
function addToCart(i) {
  const item = cart.find(c => c.index === i);
  if (item) item.qty++;
  else cart.push({ index:i, qty:1 });

  saveCart();
  cartCount.innerText = cart.reduce((a,b)=>a+b.qty,0);
}

/**************** CART POPUP ****************/
function openCartPopup() {
  if (cart.length === 0) return alert("Cart is empty");

  closePopup();

  let total = 0;
  let itemsHTML = "";

  cart.forEach(c => {
    const p = products[c.index];
    total += p.price * c.qty;

    itemsHTML += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0">
        <b>${p.name}</b>
        <div>
          <button onclick="changeQty(${c.index},-1)">−</button>
          <b>${c.qty}</b>
          <button onclick="changeQty(${c.index},1)">+</button>
        </div>
      </div>
    `;
  });

  const div = document.createElement("div");
  div.id = "cartPopup";
  div.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:9999">
      <div style="background:#fff;border-radius:16px;padding:14px;width:90%;max-width:360px">
        <h3>Your Cart</h3>
        ${itemsHTML}
        <hr>
        <p><b>FREE DELIVERY</b></p>
        <p><b>Total: ₹${total}</b></p>
        <button onclick="sendWA()" style="width:100%">Order on WhatsApp</button>
        <button onclick="closePopup()" style="width:100%;margin-top:6px;background:#ddd;color:#000">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(div);
}

function closePopup(){
  const p=document.getElementById("cartPopup");
  if(p) p.remove();
}

function changeQty(i,v){
  const item = cart.find(c=>c.index===i);
  if(!item) return;
  item.qty += v;
  if(item.qty<=0) cart = cart.filter(c=>c.index!==i);
  saveCart();
  openCartPopup();
}

/**************** WHATSAPP ****************/
function sendWA(){
  const name = document.querySelector('input[placeholder="Full name"]').value.trim();
  const phone = document.querySelector('input[placeholder="Phone number"]').value.trim();
  const address = document.querySelector('textarea').value.trim();

  if(!name || !phone || !address){
    alert("First fill Name, Phone Number and Address");
    return;
  }

  let total = 0;
  let msg = `*SASTA SILIGURI ORDER*\n\n*Your details*\nName: *${name}*\nPhone: *${phone}*\nAddress: *${address}*\n\n------------------\n`;

  cart.forEach(c=>{
    const p=products[c.index];
    total+=p.price*c.qty;
    msg+=`*${p.name}*\nQty: ${c.qty}\nRate: ₹${p.price}\n\n`;
  });

  msg+=`*Total Amount: ₹${total}*\nFREE DELIVERY\n\nThank you for choosing *Sasta Siliguri* 🙏`;

  window.open(`https://wa.me/917602884208?text=${encodeURIComponent(msg)}`,"_blank");
}

/**************** INIT ****************/
renderProducts();
