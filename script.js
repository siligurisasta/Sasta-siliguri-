const ADMIN_PASS = "1513";

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");
const list = document.getElementById("list");

const pname = document.getElementById("pname");
const price = document.getElementById("price");
const mrp = document.getElementById("mrp");
const min = document.getElementById("min");
const unit = document.getElementById("unit");
const img = document.getElementById("img");
const stock = document.getElementById("stock");

let products = [];
let currentIndex = null;

/* LOGO 3 TAP PASSWORD */
let tap = 0;
let timer = null;

logo.addEventListener("click", () => {
  tap++;
  clearTimeout(timer);
  timer = setTimeout(() => tap = 0, 700);

  if(tap === 3){
    tap = 0;
    const p = prompt("Enter admin password");
    if(p === ADMIN_PASS){
      admin.style.display = "block";
      admin.scrollIntoView({behavior:"smooth"});
    }else{
      alert("Wrong password");
    }
  }
});

/* RENDER */
function render(){
  list.innerHTML = "";
  products.forEach((p,i)=>{
    list.innerHTML += `
      <div class="product" onclick="selectProduct(${i})">
        <b>${p.name}</b><br>
        ₹${p.price} ${p.mrp ? "(MRP ₹"+p.mrp+")":""}<br>
        Min: ${p.min} ${p.unit}
      </div>
    `;
  });
}

/* CRUD */
function addProduct(){
  products.push({
    name:pname.value,
    price:price.value,
    mrp:mrp.value,
    min:min.value,
    unit:unit.value,
    img:img.value,
    stock:stock.checked
  });
  clearForm();
  render();
}

function selectProduct(i){
  const p = products[i];
  currentIndex = i;
  pname.value = p.name;
  price.value = p.price;
  mrp.value = p.mrp;
  min.value = p.min;
  unit.value = p.unit;
  img.value = p.img;
  stock.checked = p.stock;
}

function updateProduct(){
  if(currentIndex === null) return alert("Select product first");
  products[currentIndex] = {
    name:pname.value,
    price:price.value,
    mrp:mrp.value,
    min:min.value,
    unit:unit.value,
    img:img.value,
    stock:stock.checked
  };
  clearForm();
  render();
}

function deleteProduct(){
  if(currentIndex === null) return alert("Select product first");
  products.splice(currentIndex,1);
  clearForm();
  render();
}

function clearForm(){
  pname.value="";
  price.value="";
  mrp.value="";
  min.value="";
  unit.value="";
  img.value="";
  stock.checked=true;
  currentIndex=null;
}
