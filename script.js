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

/* SAVE */
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
    const product = { name:pname, price, mrp, min, unit, stock, img };

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
        <p>Minimum: ${p.min || 1} ${p.unit || ""}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
        <button onclick="event.stopPropagation(); openCart(${i})">Add to Cart</button>
      </div>
    `;
  });
}

/**************** EDIT ****************/
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
  admin.scrollIntoView({behavior:"smooth"});
}

/**************** CART POPUP ****************/
let cartItem = null;

function openCart(i){
  cartItem = { ...products[i], qty:1 };
  showPopup();
  cartCount.innerText = 1;
}

function showPopup(){
  closePopup();
  const div = document.createElement("div");
  div.id = "cartPopup";
  div.innerHTML = `
  <div style="position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:9999">
    <div style="background:#fff;border-radius:18px;padding:16px;width:90%;max-width:360px">
      <h3>Your Cart</h3>

      <div style="display:flex;gap:10px;align-items:center">
        <img src="${cartItem.img}" style="width:70px;height:70px;border-radius:12px;object-fit:cover">
        <div>
          <b>${cartItem.name}</b><br>₹${cartItem.price}
        </div>
      </div>

      <div style="display:flex;gap:10px;align-items:center;margin:12px 0">
        <button onclick="qty(-1)">−</button>
        <b>${cartItem.qty}</b>
        <button onclick="qty(1)">+</button>
      </div>

      <p><b>FREE DELIVERY</b></p>
      <p><b>Total: ₹${cartItem.qty * cartItem.price}</b></p>

      <button onclick="sendWA()" style="width:100%">Order on WhatsApp</button>
      <button onclick="closePopup()" style="width:100%;margin-top:6px;background:#ddd;color:#000">Close</button>
    </div>
  </div>`;
  document.body.appendChild(div);
}

function qty(v){
  cartItem.qty += v;
  if(cartItem.qty<1) cartItem.qty=1;
  showPopup();
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
  const total=cartItem.qty*cartItem.price;

  const msg=`*Your details*
Name: *${name}*
Phone: *${phone}*
Address: *${address}*

------------------
*Item*
*${cartItem.name}*
Qty: ${cartItem.qty}
Rate: ₹${cartItem.price}

------------------
*Total Amount: ₹${total}*

Thank you for choosing *Sasta Siliguri* 🙏`;

  window.open(`https://wa.me/917602884208?text=${encodeURIComponent(msg)}`,"_blank");
}

/**************** LOAD ****************/
renderProducts();
