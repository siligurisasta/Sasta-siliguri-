const ADMIN_PASS = "1513";

/* ===== ADMIN 3 TAP LOGIC ===== */
let taps = 0;
let timer = null;

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");

logo.addEventListener("click", () => {
  taps++;
  clearTimeout(timer);
  timer = setTimeout(() => taps = 0, 700);

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

/* ===== PRODUCT + CART ===== */
const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

let products = [];
let editIndex = -1;
let cart = 0;

/* ===== ADD / UPDATE PRODUCT ===== */
function saveProduct() {
  const pname = document.getElementById("pname").value.trim();
  const price = document.getElementById("price").value;
  const mrp = document.getElementById("mrp").value;
  const min = document.getElementById("min").value;
  const unit = document.getElementById("unit").value;
  const stock = document.getElementById("stock").checked;
  const fileInput = document.getElementById("img");

  if (!pname || !price) {
    alert("Product name & price required");
    return;
  }

  /* IMAGE HANDLING */
  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveFinalProduct(e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveFinalProduct("https://via.placeholder.com/300");
  }

  function saveFinalProduct(imgSrc) {
    const product = {
      name: pname,
      price,
      mrp,
      min,
      unit,
      stock,
      img: imgSrc
    };

    if (editIndex === -1) {
      products.push(product);
    } else {
      products[editIndex] = product;
      editIndex = -1;
    }

    renderProducts();
    clearForm();
  }
}

/* ===== DELETE PRODUCT ===== */
function deleteProduct() {
  if (editIndex === -1) {
    alert("Select product to delete");
    return;
  }
  products.splice(editIndex, 1);
  editIndex = -1;
  renderProducts();
  clearForm();
}

/* ===== CLEAR FORM ===== */
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

/* ===== RENDER PRODUCTS ===== */
function renderProducts() {
  productsDiv.innerHTML = "";

  products.forEach((p, i) => {
    productsDiv.innerHTML += `
      <div class="product" onclick="editProduct(${i})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <div class="price">
          <del>₹${p.mrp || ""}</del> <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min || 1} ${p.unit || ""}</p>
        <p>${p.stock ? "In stock ✅" : "Out of stock ❌"}</p>
        <button onclick="event.stopPropagation(); addCart()">Add to Cart</button>
      </div>
    `;
  });
}

/* ===== EDIT PRODUCT ===== */
function editProduct(i) {
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

/* ===== CART ===== */
function addCart() {
  cart++;
  cartCount.innerText = cart;
}

/* ===== WHATSAPP ORDER ===== */
function orderWhatsApp() {
  alert("WhatsApp order integration next step 🔥");
}
