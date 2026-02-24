const ADMIN_PASS = "1513";

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");
const list = document.getElementById("productList");
const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");

let tap = 0;
let products = [];
let cart = {};

logo.onclick = () => {
  tap++;
  setTimeout(()=>tap=0,600);
  if(tap === 3){
    const p = prompt("Admin password");
    if(p === ADMIN_PASS){
      admin.style.display = "block";
    }
  }
};

function render(){
  list.innerHTML += `
<div class="product-card">

  <img class="p-img" src="${p.img}">

  <h3 class="p-title">${p.name}</h3>

  <div class="price-line">
    <span class="market">₹${p.mrp}</span>
    <span class="offer">₹${p.price}</span>
  </div>

  <div class="min-order">
    Minimum order: ${p.min || 1} ${p.unit || ""}
  </div>

  <div class="stock">
    In stock ✅
  </div>

  <div class="qty-box">
    <button onclick="event.stopPropagation(); qty(${i},-1)">−</button>
    <span id="q${i}">1</span>
    <button onclick="event.stopPropagation(); qty(${i},1)">+</button>
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

let editIndex = null;

function editProduct(i){
  const p = products[i];
  pname.value = p.name;
  pprice.value = p.price;
  pmrp.value = p.mrp;
  editIndex = i;
  admin.scrollIntoView({behavior:"smooth"});
}

function deleteProduct(i){
  if(confirm("Delete this product?")){
    products.splice(i,1);
    render();
  }
}

function addProduct(){
  const name = pname.value;
  const price = pprice.value;
  const mrp = pmrp.value;
  const file = pimg.files[0];

  let img = "";
  if(file){
    img = URL.createObjectURL(file);
  }else if(editIndex !== null){
    img = products[editIndex].img;
  }

  if(editIndex !== null){
    products[editIndex] = {name,price,mrp,img};
    editIndex = null;
  }else{
    products.push({name,price,mrp,img});
  }

  pname.value = "";
  pprice.value = "";
  pmrp.value = "";
  pimg.value = "";

  render();
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

