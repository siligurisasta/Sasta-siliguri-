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

function addProduct(){
  const name = pname.value;
  const price = pprice.value;
  const mrp = pmrp.value;
  const file = pimg.files[0];
  if(!file) return alert("Image select karo");

  const img = URL.createObjectURL(file);
  products.push({name, price, mrp, img});
  render();
}

function render(){
  list.innerHTML = "";
  products.forEach((p,i)=>{
    list.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h4>${p.name}</h4>
        <del>₹${p.mrp}</del> <b>₹${p.price}</b>
        <div class="qty">
          <button onclick="qty(${i},-1)">-</button>
          <span id="q${i}">1</span>
          <button onclick="qty(${i},1)">+</button>
        </div>
        <button class="add-btn" onclick="addCart(${i})">Add to Cart</button>
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
