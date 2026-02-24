const ADMIN_PASSWORD = "1513";

let currentProduct = null;

function login(){
  const pass = document.getElementById("adminPass").value;

  if(pass === ADMIN_PASSWORD){
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    alert("Admin panel unlocked");
  }else{
    alert("Wrong password");
  }
}

function getProductData(){
  return {
    name: pname.value,
    price: pprice.value,
    mrp: pmrp.value,
    min: pmin.value,
    unit: punit.value,
    img: pimg.value,
    stock: pstock.checked
  };
}

function saveProduct(){
  if(!currentProduct){
    alert("No product selected");
    return;
  }
  currentProduct = getProductData();
  alert("Product updated");
}

function addProduct(){
  currentProduct = getProductData();
  alert("New product added (demo)");
}

function deleteProduct(){
  if(!currentProduct){
    alert("No product selected");
    return;
  }
  currentProduct = null;
  alert("Product deleted");
}
