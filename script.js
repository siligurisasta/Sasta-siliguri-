const ADMIN_PASS = "1513";

document.addEventListener("DOMContentLoaded", () => {

  const logo = document.getElementById("logo");
  const admin = document.getElementById("admin");
  const list = document.getElementById("productList");
  const cartBar = document.getElementById("cartBar");
  const cartCount = document.getElementById("cartCount");

  let tap = 0;
  let products = [];
  let cart = {};

  logo.addEventListener("click", () => {
    tap++;
    clearTimeout(window.tapTimer);
    window.tapTimer = setTimeout(() => tap = 0, 800);

    if (tap === 3) {
      tap = 0;
      const p = prompt("Admin password");
      if (p === ADMIN_PASS) {
        admin.style.display = "block";
        admin.scrollIntoView({ behavior: "smooth" });
        alert("Admin panel unlocked");
      } else {
        alert("Wrong password");
      }
    }
  });


function render(){
  list.innerHTML = "";

  products.forEach((p, i) => {
    list.innerHTML += `
      <div class="product-card" onclick="selectProduct(${i})">

        <img class="p-img" src="${p.img || 'https://via.placeholder.com/300'}">

        <h3 class="p-title">${p.name}</h3>

        <div class="price-line">
          ${p.mrp ? `<span class="market">₹${p.mrp}</span>` : ""}
          <span class="offer">₹${p.price}</span>
        </div>

        <div class="min-order">
          Minimum order: ${p.min || 1} ${p.unit || ""}
        </div>

        <div class="stock">In stock ✅</div>

        <div class="qty-box" onclick="event.stopPropagation()">
          <button onclick="qty(${i},-1)">−</button>
          <span id="q${i}">1</span>
          <button onclick="qty(${i},1)">+</button>
        </div>

        <button class="add-cart-btn"
          onclick="event.stopPropagation(); addCart(${i})">
          Add to Cart
        </button>

      </div>
    `;
  });
}


function qty(i,d){
  let q = document.getElementById("q"+i);
  let v = +q.innerText + d;
  if(v < 1) v = 1;
  q.innerText = v;
}

function addCart(i){
  let q = +document.getElementById("q"+i).innerText;
  cart[i] = (cart[i] || 0) + q;
  cartCount.innerText = Object.values(cart).reduce((a,b)=>a+b,0);
  cartBar.style.display = "flex";
}

function orderNow(){
  alert("Next step: WhatsApp order");
}

let currentIndex = null;

function selectProduct(i){
  const p = products[i];
  currentIndex = i;

  pname.value = p.name;
  pprice.value = p.price;
  pmrp.value = p.mrp || "";
  pmin.value = p.min || "";
  punit.value = p.unit || "";
  pimgurl.value = p.img || "";

  admin.style.display = "block";
  admin.scrollIntoView({behavior:"smooth"});
}

  function saveUpdate(){
  if(currentIndex === null) return alert("Select product first");

  products[currentIndex] = {
    name: pname.value,
    price: pprice.value,
    mrp: pmrp.value,
    min: pmin.value,
    unit: punit.value,
    img: pimgurl.value || products[currentIndex].img
  };

  render();
  alert("Product updated");
}

function addNew(){
  products.push({
    name: pname.value,
    price: pprice.value,
    mrp: pmrp.value,
    min: pmin.value,
    unit: punit.value,
    img: pimgurl.value
  });

  render();
  alert("New product added");
}

function deleteCurrent(){
  if(currentIndex === null) return alert("Select product first");

  if(confirm("Delete this product?")){
    products.splice(currentIndex,1);
    currentIndex = null;
    render();
    alert("Product deleted");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  render();
});
