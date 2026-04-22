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

/**************** 🔥 REALTIME PRODUCTS (ADD) ****************/
db.collection("products").onSnapshot(snapshot => {
  products = [];
  snapshot.forEach(doc => {
    products.push({
      id: doc.id,
      ...doc.data()
    });
  });

  document.getElementById("loadingText")?.remove();
  renderProducts();
});

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
      document.getElementById("orderSection").style.display = "block";
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

    let doc = null;

    if (editIndex !== -1) {
      doc = products[editIndex]; // ✅ FIX
    }

    if (editIndex === -1) {
      await db.collection("products").add(product);
    } else {
      await db.collection("products").doc(doc.id).update(product);
    }

    editIndex = -1;
    clearForm();
  }
}

/**************** DELETE PRODUCT ****************/
async function deleteProduct() {
  if (editIndex === -1) {
    alert("Select product first");
    return;
  }
  
  const doc = products[editIndex]; // ✅ FIX

  if (doc) {
    await db.collection("products").doc(doc.id).delete();
  }

  editIndex = -1;
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

/**************** ADD TO CART ****************/
function addToCart(i) {
  const product = products[i];

  const found = cart.find(item => item.name === product.name);

  if (found) found.qty += 1;
  else cart.push({ name: product.name, price: Number(product.price), qty: 1 });

  updateCartCount();
  saveCart();
}

/**************** CART COUNT ****************/
function updateCartCount() {
  let total = 0;
  cart.forEach(i => total += i.qty);
  cartCount.innerText = total;
}

/**************** INIT ****************/
renderProducts();
updateCartCount();
