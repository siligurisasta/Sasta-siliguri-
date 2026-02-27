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

/**************** PRODUCTS + STORAGE ****************/
const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

let products = JSON.parse(localStorage.getItem("sasta_products")) || [];
let editIndex = -1;
let cart = 0;

/* SAVE TO LOCAL STORAGE */
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

  /* IMAGE */
  if (imgInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveFinal(e.target.result);
    };
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    saveFinal("https://via.placeholder.com/300");
  }

  function saveFinal(imgSrc) {
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
        <button onclick="event.stopPropagation(); addCart()">Add to Cart</button>
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
function addCart() {
  cart++;
  cartCount.innerText = cart;
}

/**************** WHATSAPP ****************/
function orderWhatsApp() {
  alert("WhatsApp order integration next step 🔥");
}

/**************** ON PAGE LOAD ****************/
renderProducts();
