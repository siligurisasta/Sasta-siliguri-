const ADMIN_PASS = "1513";

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");

let tap = 0;
let timer = null;

// 🔐 logo par 3 tap = password
logo.addEventListener("click", () => {
  tap++;
  clearTimeout(timer);
  timer = setTimeout(() => tap = 0, 800);

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

// 🟢 Dummy product logic (working buttons)
function saveProduct(){
  alert("Product saved / updated ✅");
}

function addProduct(){
  alert("New product added ✅");
  clearFields();
}

function deleteProduct(){
  if(confirm("Delete product?")){
    alert("Product deleted ❌");
    clearFields();
  }
}

function clearFields(){
  pname.value = "";
  price.value = "";
  mrp.value = "";
  min.value = "";
  unit.value = "";
  img.value = "";
}
