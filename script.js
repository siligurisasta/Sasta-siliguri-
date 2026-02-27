const ADMIN_PASS = "1513";

/* ELEMENTS */
const logo = document.getElementById("logo");
const admin = document.getElementById("admin");
const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

const pname = document.getElementById("pname");
const price = document.getElementById("price");
const mrp = document.getElementById("mrp");
const min = document.getElementById("min");
const unit = document.getElementById("unit");
const img = document.getElementById("img"); // image URL (optional)
const file = document.getElementById("file"); // file upload
const stock = document.getElementById("stock");

/* STATE */
let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = 0;

/* =========================
   ADMIN : 3 TAP + PASSWORD
========================= */
let taps = 0;
let timer = null;

admin.style.display = "none";

logo.addEventListener("click", () => {
  taps++;
  clearTimeout(timer);
  timer = setTimeout(() => (taps = 0), 700);

  if (taps === 3) {
    taps = 0;
    const p = prompt("Enter admin password");
    if (p === ADMIN_PASS) {
      admin.style.display = "block";
      admin.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Wrong password");
    }
  }
});

/* =========================
   ADD PRODUCT
========================= */
function addProduct() {
  if (!pname.value || !price.value) {
    alert("Product name & price required");
    return;
  }

  // IMAGE PRIORITY:
  // 1️⃣ File upload
  // 2️⃣ Image URL
  // 3️⃣ Placeholder
  if (file.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveProduct(e.target.result);
    };
    reader.readAsDataURL(file.files[0]);
  } else {
    saveProduct(img.value || "https://via.placeholder.com/300");
  }
}

function saveProduct(imageSrc) {
  const p = {
    name: pname.value,
    price: price.value,
    mrp: mrp.value,
    min: min.value,
    unit: unit.value,
    img: imageSrc,
    stock: stock.checked
  };

  products.push(p);
  localStorage.setItem("products", JSON.stringify(products));

  renderProducts();
  clearForm();
}

/* =========================
   CLEAR FORM
========================= */
function clearForm() {
  pname.value = "";
  price.value = "";
  mrp.value = "";
  min.value = "";
  unit.value = "";
  img.value = "";
  file.value = "";
  stock.checked = true;
}

/* =========================
   RENDER PRODUCTS
========================= */
function renderProducts() {
  productsDiv.innerHTML = "";

  products.forEach((p) => {
    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <div class="price">
          <del>₹${p.mrp || ""}</del>
          <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min || 1} ${p.unit || ""}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
        <button onclick="addCart()">Add to Cart</button>
      </div>
    `;
  });
}

/* =========================
   CART
========================= */
function addCart() {
  cart++;
  cartCount.innerText = cart;
}

function orderWhatsApp() {
  alert("WhatsApp order integration next step 🔥");
}

/* INIT */
renderProducts();
