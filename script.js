const firebaseConfig = {
  apiKey: "AIzaSyAsizdDClYbklJxVfDnLNdYc2OQS7yKDfw",
  authDomain: "sastasiliguri-in.firebaseapp.com",
  projectId: "sastasiliguri-in",
  storageBucket: "sastasiliguri-in.appspot.com",
  messagingSenderId: "460473584400",
  appId: "1:460473584400:web:c8106acbd7045af831b395"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

let products = [];
let editIndex = -1;

/**************** CART (FIXED) ****************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**************** ADD / UPDATE PRODUCT ****************/
function saveProduct() {
  const pname = document.getElementById("pname").value.trim();
  const price = parseFloat(document.getElementById("price").value);
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

  async function saveFinal(img) {
    const product = {
      name: pname,
price: price || 0,
      mrp,
      min,
      unit,
      stock,
      img
    };

db.collection("products").onSnapshot(snapshot => {
  products = [];
  snapshot.forEach(doc => {
    products.push(doc.data());
  });
  renderProducts();
});
    
let doc = null;

if (editIndex !== -1) {
  doc = snap.docs[editIndex];
}

if (editIndex === -1) {
  await db.collection("products").add(product);
} else {
  await db.collection("products").doc(doc.id).update(product);
}

editIndex = -1;
await loadProducts();
clearForm();
  }
}

/**************** DELETE PRODUCT ****************/
async function deleteProduct() {
  if (editIndex === -1) {
    alert("Select product first");
    return;
  }
  
  await db.collection("products").get().then((snap) => {
  const doc = snap.docs[editIndex];
  if (doc) {
    db.collection("products").doc(doc.id).delete();
  }
});

editIndex = -1;
await loadProducts();
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

  products.forEach((p, i) => {
    productsDiv.innerHTML += `
<div class="product" onclick="editProduct(${i})">

<img src="${p.img}">

<h3>${p.name}</h3>

<div class="row">
<span>Offer price</span>
<span class="new">₹${p.price}</span>
</div>

<div class="row">
<span>Market price</span>
<span class="old">${p.mrp ? `₹${p.mrp}` : ""}</span>
</div>

<div class="row">
<span>Minimum order</span>
<span>${p.min || 1} ${p.unit || ""}</span>
</div>

<p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>

<div class="qty-box" onclick="event.stopPropagation()">
<button onclick="decrease(this)">-</button>
<input type="text" value="1">
<button onclick="increase(this)">+</button>
</div>

<button onclick="event.stopPropagation(); addToCart(${i})">
Add to Cart
</button>

</div>
`;
    
  });
}

/**************** EDIT PRODUCT ****************/
function editProduct(i) {

  // ❌ agar admin panel open nahi hai → kuch mat karo
  if (admin.style.display !== "block") return;

  const p = products[i];
  editIndex = i;

  pname.value = p.name;
  price.value = p.price;
  mrp.value = p.mrp;
  min.value = p.min;
  unit.value = p.unit;
  stock.checked = p.stock;

  admin.scrollIntoView({ behavior: "smooth" });
}


/**************** ADD TO CART (NO POPUP) ****************/
function addToCart(i) {
  const product = products[i];

  const found = cart.find(item => item.name === product.name);

  if (found) {
    found.qty += 1;
  } else {
    cart.push({
      name: product.name,
      price: Number(product.price),
      qty: 1
    });
  }

  updateCartCount();
  saveCart();
}

/**************** CART COUNT ****************/
function updateCartCount() {
  let total = 0;
  cart.forEach(i => total += i.qty);
  cartCount.innerText = total;
}

/**************** CART POPUP ****************/
  function openCartPopup() {
  if (cart.length === 0) {
    alert("Please add item to cart first");
    return;
  }

  let itemsHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.qty * item.price;

    itemsHTML += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div>
          <b>${item.name}</b><br>
          <span style="font-size:13px;color:#555">
            ₹${item.price} × ${item.qty} = ₹${item.price * item.qty}
          </span>
        </div>
        <div>
          <button onclick="changeQty(${i}, -1)">-</button>
          <b>${item.qty}</b>
          <button onclick="changeQty(${i}, 1)">+</button>
        </div>
      </div>
    `;
  }); // ✅ forEach properly closed

  closePopup(); // ✅ loop ke bahar

  const div = document.createElement("div");
  div.id = "cartPopup";
  div.innerHTML = `
<div style="position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999">
  <div style="background:#fff;border-radius:18px;padding:18px;width:90%;max-width:360px;font-family:Arial">

    <div style="display:flex;align-items:center;justify-content:space-between">
      <h3 style="margin:0;font-size:18px">🛒 Your Cart</h3>
      <span style="font-size:13px;font-weight:bold;letter-spacing:1px">
        SASTA SILIGURI
      </span>
    </div>

    <div style="height:2px;width:100%;background:#2e7d32;margin:10px 0;border-radius:2px"></div>

    ${itemsHTML}

    <p style="margin:8px 0 2px;font-size:12px;font-weight:600">FREE DELIVERY</p>

    <div style="height:2px;width:120px;background:#2e7d32;margin:8px 0;border-radius:2px"></div>

    <p style="font-size:16px"><b>Total: ₹${total}</b></p>
    
<button id="popupWA" onclick="placeOrder()" style="width:100%;margin-top:10px">
  Place Order
</button>

    <button onclick="closePopup()" style="width:100%;margin-top:6px;background:#e0e0e0;color:#000">
      Close
    </button>
  </div>
</div>
`;

  document.body.appendChild(div);
setTimeout(() => {
  const btn = document.getElementById("popupWA");
  if(btn){
    btn.onclick = placeOrder;
  }
}, 300);
}

/**************** QTY CHANGE ****************/
function changeQty(i, v) {
  cart[i].qty += v;

  if (cart[i].qty <= 0) {
    cart.splice(i, 1);
  }

  updateCartCount();

  // 👇 NEW FIX
  if (cart.length === 0) {
    closePopup();   // cart empty → popup band
  } else {
    openCartPopup(); // warna refresh popup
  }
}

/**************** CLOSE POPUP ****************/
function closePopup() {
  const p = document.getElementById("cartPopup");
  if (p) p.remove();
}

/**************** WHATSAPP ****************/
function sendWA() {
  const name = document.querySelector('input[placeholder="Full name *"]').value.trim();
const phone = document.querySelector('input[placeholder="Phone number *"]').value.trim();
const address = document.querySelector('textarea').value.trim();

  if (!name || !phone || !address) {
    alert("Please fill name, phone & address first");
    return;
  }

 let msg = `*Order Confirmation - Sasta Siliguri*\n\n`;

msg += `*Customer Details*\n\n`;
msg += `*Name*      :  ${name}\n`;
msg += `*Phone*     :  ${phone}\n`;
msg += `*Address*  :  ${address}\n\n`;

msg += `*Order Items*\n\n`;

let total = 0;

cart.forEach(item => {
  msg += `${item.name} ×${item.qty} — ₹${item.price}\n\n`;
  total += item.qty * item.price;
});

msg += `_____________________________\n`;
msg += `*Total : ₹${total}*\n`;
msg += `_____________________________\n`;
msg += `Delivery : Same Day\n`;
msg += `Payment  : Cash on Delivery\n\n`;

msg += `*Thank you for choosing Sasta Siliguri*.\n\n`;
msg += `We will contact you shortly.`;
  localStorage.removeItem("cart");
cart = [];
updateCartCount();
window.location.href = "https://wa.me/917602884208?text=" + encodeURIComponent(msg);
}

/**************** LOAD ****************/
renderProducts();
updateCartCount();
const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

searchInput.addEventListener("input", () => {

const value = searchInput.value.toLowerCase();
suggestions.innerHTML = "";

if(!value){
suggestions.style.display="none";
renderProducts();
return;
}

let filtered = products.filter(p =>
p.name.toLowerCase().includes(value)
);

filtered.forEach(p=>{
const div=document.createElement("div");
div.innerText=p.name;
div.onclick=()=>{
searchInput.value=p.name;
suggestions.style.display="none";
renderFiltered(p.name);
};
suggestions.appendChild(div);
});

suggestions.style.display="block";

renderFiltered(value);

});

function renderFiltered(value){

productsDiv.innerHTML="";

products
.filter(p=>p.name.toLowerCase().includes(value))
.forEach((p,i)=>{

productsDiv.innerHTML+=`
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

function increase(btn){
let input = btn.parentElement.querySelector("input");
input.value = parseInt(input.value) + 1;
}

function decrease(btn){
let input = btn.parentElement.querySelector("input");
if(input.value > 1){
input.value = parseInt(input.value) - 1;
}
}

  async function loadProducts(){
  const snap = await db.collection("products").get();
  products = [];

  snap.forEach(doc => {
    products.push(doc.data());
  });
    document.getElementById("loadingText")?.remove();

  renderProducts();
}

loadProducts();

window.openCartPopup = openCartPopup;
window.changeQty = changeQty;
window.closePopup = closePopup;
window.sendWA = sendWA;
window.placeOrder = placeOrder;


function generateOrderId(){
  return Math.floor(1000 + Math.random() * 9000);
}

async function placeOrder(){

  const name = document.querySelector('input[placeholder="Full name *"]')?.value.trim();
const phone = document.querySelector('input[placeholder="Phone number *"]')?.value.trim();
const address = document.querySelector('textarea[placeholder="Full address *"]')?.value.trim();

  if(!name || !phone || !address){
    alert("Please fill name, phone & address");
    return;
  }

  if(cart.length === 0){
    alert("Cart is empty");
    return;
  }

  const orderId = generateOrderId();

  let total = 0;

  const items = cart.map(i=>{
    total += i.price * i.qty;
    return {
      name: i.name,
      qty: i.qty,
      price: i.price
    };
  });

  const order = {
    orderId,
    name,
    phone,
    address,
    items,
    total,
    status: "Pending",
    assignedTo: "",
    assignedName: "",
    time: new Date()
  };

  await db.collection("orders").add(order);

  alert("Order Placed! Your ID: " + orderId);

  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  closePopup();
}
// placeOrder END

}

function loadOrders(){
  db.collection("orders")
    .orderBy("time","desc")
    .onSnapshot(snapshot=>{
      
      let html = "";
      
      snapshot.forEach(doc=>{
        const o = doc.data();

        html += `
          <div>
            <b>ID:</b> ${o.orderId}<br>
            <b>Name:</b> ${o.name}<br>
            <b>Total:</b> ₹${o.total}<br>
            <b>Status:</b> ${o.status}
          </div>
        `;
      });

      document.getElementById("ordersList").innerHTML = html;
    });
}

loadOrders();
