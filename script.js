const ADMIN_PASS = "1513";

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");
const list = document.getElementById("list");
const cartBar = document.getElementById("cartBar");
const count = document.getElementById("count");

let tap = 0;
let products = JSON.parse(localStorage.getItem("products") || "[]");
let cart = JSON.parse(localStorage.getItem("cart") || "{}");

logo.addEventListener("click", () => {
  tap++;
  setTimeout(() => tap = 0, 600);
  if (tap === 3) {
    const p = prompt("Admin password");
    if (p === ADMIN_PASS) admin.style.display = "block";
  }
});

function addProduct(){
  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const mrp = document.getElementById("pmrp").value;
  const file = document.getElementById("pimg").files[0];
  if(!file) return alert("Image required");

  const img = URL.createObjectURL(file);

  products.push({name,price,mrp,img});
  localStorage.setItem("products", JSON.stringify(products));
  render();
}

function render(){
  list.innerHTML = "";
  products.forEach((p,i)=>{
    list.innerHTML += `
    <div class="product">
      <img src="${p.img}">
      <h4>${p.name}</h4>
      <del>₹${p.mrp}</del>
      <b class="price">₹${p.price}</b>

      <div class="qty">
        <button onclick="qty(${i},-1)">−</button>
        <span id="q${i}">1</span>
        <button onclick="qty(${i},1)">+</button>
      </div>

      <button class="add" onclick="addCart(${i})">Add to Cart</button>
    </div>`;
  });
}

function qty(i,d){
  const q = document.getElementById("q"+i);
  q.innerText = Math.max(1, +q.innerText + d);
}

function addCart(i){
  const q = +document.getElementById("q"+i).innerText;
  cart[i] = (cart[i] || 0) + q;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart(){
  const total = Object.values(cart).reduce((a,b)=>a+b,0);
  count.innerText = total;
  cartBar.style.display = total ? "flex" : "none";
}

function order(){
  alert("Next step: WhatsApp order");
}

render();
updateCart();
