const ADMIN_PASS = "1513";

const adminPanel = document.getElementById("adminPanel");

let products = [];
let current = null;

/* 🔐 PASSWORD CHECK ON LOAD */
setTimeout(() => {
  const p = prompt("Enter Admin Password");
  if (p === ADMIN_PASS) {
    adminPanel.style.display = "block";
    alert("Admin Panel Unlocked ✅");
  } else {
    alert("Wrong password ❌");
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:50px'>Access Denied</h2>";
  }
}, 300);

/* ===== PRODUCT LOGIC ===== */

const pname = document.getElementById("pname");
const pprice = document.getElementById("pprice");
const pmrp = document.getElementById("pmrp");
const pmin = document.getElementById("pmin");
const punit = document.getElementById("punit");
const pimg = document.getElementById("pimg");
const pstock = document.getElementById("pstock");
const list = document.getElementById("list");

function render(){
  list.innerHTML = "";
  products.forEach((p,i)=>{
    const div = document.createElement("div");
    div.className = "item";
    div.innerText = `${p.name} – ₹${p.price}`;
    div.onclick = ()=>select(i);
    list.appendChild(div);
  });
}

function select(i){
  const p = products[i];
  current = i;

  pname.value = p.name;
  pprice.value = p.price;
  pmrp.value = p.mrp;
  pmin.value = p.min;
  punit.value = p.unit;
  pimg.value = p.img;
  pstock.checked = p.stock;
}

function addProduct(){
  products.push({
    name:pname.value,
    price:pprice.value,
    mrp:pmrp.value,
    min:pmin.value,
    unit:punit.value,
    img:pimg.value,
    stock:pstock.checked
  });
  clearForm();
  render();
}

function saveProduct(){
  if(current === null) return alert("Select product first");

  products[current] = {
    name:pname.value,
    price:pprice.value,
    mrp:pmrp.value,
    min:pmin.value,
    unit:punit.value,
    img:pimg.value,
    stock:pstock.checked
  };
  render();
  alert("Product updated");
}

function deleteProduct(){
  if(current === null) return alert("Select product first");
  products.splice(current,1);
  clearForm();
  render();
}

function clearForm(){
  pname.value="";
  pprice.value="";
  pmrp.value="";
  pmin.value="";
  punit.value="";
  pimg.value="";
  pstock.checked=true;
  current=null;
}
