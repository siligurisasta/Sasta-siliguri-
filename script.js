const ADMIN_PASS = "1513";

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");

const pname = document.getElementById("pname");
const price = document.getElementById("price");
const mrp = document.getElementById("mrp");
const min = document.getElementById("min");
const unit = document.getElementById("unit");
const img = document.getElementById("img");
const file = document.getElementById("file");
const stock = document.getElementById("stock");

// product list container
let list = document.getElementById("productList");

// ---------- ADMIN OPEN (3 TAP) ----------
let tap = 0, timer = null;

logo.addEventListener("click", () => {
  tap++;
  clearTimeout(timer);
  timer = setTimeout(() => tap = 0, 800);

  if (tap === 3) {
    tap = 0;
    const p = prompt("Enter admin password");
    if (p === ADMIN_PASS) {
      admin.style.display = "block";
      admin.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Wrong password");
    }
  }
});

// ---------- DATA ----------
let products = JSON.parse(localStorage.getItem("products")) || [];
let editIndex = null;

// ---------- RENDER ----------
function renderProducts() {
  if (!list) return;
  list.innerHTML = "";

  products.forEach((p, i) => {
    list.innerHTML += `
      <div class="product-card" onclick="editProduct(${i})">
        <img src="${p.img || 'https://via.placeholder.com/300'}">
        <h3>${p.name}</h3>
        <p>₹${p.price} <s>₹${p.mrp}</s></p>
        <p>Min: ${p.min} ${p.unit}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
      </div>
    `;
  });
}

// ---------- ADD / UPDATE ----------
function addProduct() {
  if (!pname.value || !price.value) {
    alert("Name & price required");
    return;
  }

  let imageURL = img.value;

  if (file.files[0]) {
    imageURL = URL.createObjectURL(file.files[0]);
  }

  const data = {
    name: pname.value,
    price: price.value,
    mrp: mrp.value,
    min: min.value,
    unit: unit.value,
    img: imageURL,
    stock: stock.checked
  };

  products.push(data);
  localStorage.setItem("products", JSON.stringify(products));

  clearFields();
  renderProducts();
  alert("Product added ✅");
}

function saveProduct() {
  if (editIndex === null) {
    alert("Select product to update");
    return;
  }

  products[editIndex] = {
    name: pname.value,
    price: price.value,
    mrp: mrp.value,
    min: min.value,
    unit: unit.value,
    img: img.value || products[editIndex].img,
    stock: stock.checked
  };

  localStorage.setItem("products", JSON.stringify(products));
  editIndex = null;

  clearFields();
  renderProducts();
  alert("Product updated ✅");
}

function deleteProduct() {
  if (editIndex === null) {
    alert("Select product first");
    return;
  }

  if (confirm("Delete this product?")) {
    products.splice(editIndex, 1);
    localStorage.setItem("products", JSON.stringify(products));
    editIndex = null;

    clearFields();
    renderProducts();
    alert("Product deleted ❌");
  }
}

// ---------- EDIT ----------
function editProduct(i) {
  const p = products[i];
  editIndex = i;

  pname.value = p.name;
  price.value = p.price;
  mrp.value = p.mrp;
  min.value = p.min;
  unit.value = p.unit;
  img.value = p.img || "";
  stock.checked = p.stock;

  admin.scrollIntoView({ behavior: "smooth" });
}

// ---------- CLEAR ----------
function clearFields() {
  pname.value = "";
  price.value = "";
  mrp.value = "";
  min.value = "";
  unit.value = "";
  img.value = "";
  file.value = "";
  stock.checked = true;
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", renderProducts);
