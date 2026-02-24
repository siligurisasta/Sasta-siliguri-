const ADMIN_PASS = "1513";

let tap = 0;
let timer = null;
let products = [];
let cart = {};
let editIndex = null;

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");
const list = document.getElementById("productList");
const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");

logo.addEventListener("click",()=>{
  tap++;
  clearTimeout(timer);
  timer = setTimeout(()=>tap=0,800);

  if(tap===3){
    tap=0;
    const p = prompt("Admin password");
    if(p===ADMIN_PASS){
      admin.style.display="block";
      admin.scrollIntoView({behavior:"smooth"});
    }else{
      alert("Wrong password");
    }
  }
});

function render(){
  list.innerHTML="";
  products.forEach((p,i)=>{
    list.innerHTML+=`
      <div class="product">
        <img src="${p.img}">
        <h4>${p.name}</h4>
        <div class="price">
          <del>₹${p.mrp}</del> <b>₹${p.price}</b>
        </div>
        <div>Min: ${p.min} ${p.unit}</div>
        <div>In stock ✅</div>
        <div class="qty">
          <button onclick="addCart(${i})">Add</button>
        </div>
      </div>`;
  });
}

function addProduct(){
  products.push({
    name:pname.value,
    price:pprice.value,
    mrp:pmrp.value,
    min:pmin.value,
    unit:punit.value,
    img:pimg.value || "https://via.placeholder.com/300"
  });
  render();
}

function updateProduct(){
  if(editIndex===null)return;
  products[editIndex]={
    name:pname.value,
    price:pprice.value,
    mrp:pmrp.value,
    min:pmin.value,
    unit:punit.value,
    img:pimg.value
  };
  render();
}

function deleteProduct(){
  if(editIndex===null)return;
  products.splice(editIndex,1);
  editIndex=null;
  render();
}

function addCart(i){
  cart[i]=(cart[i]||0)+1;
  cartCount.innerText=Object.values(cart).reduce((a,b)=>a+b,0);
  cartBar.style.display="flex";
}
