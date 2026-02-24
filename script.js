const ADMIN_PASS = "1513";
let taps = 0;
let timer = null;

const admin = document.getElementById("admin");
const logo = document.getElementById("logo");
const productsDiv = document.getElementById("products");
const cartCount = document.getElementById("cartCount");

let products = [];
let cart = 0;

/* 3 TAP LOGIC */
logo.addEventListener("click", () => {
  taps++;
  clearTimeout(timer);
  timer = setTimeout(()=>taps=0,700);

  if(taps===3){
    taps=0;
    const p = prompt("Enter admin password");
    if(p===ADMIN_PASS){
      admin.style.display="block";
      admin.scrollIntoView({behavior:"smooth"});
    }else{
      alert("Wrong password");
    }
  }
});

/* ADD PRODUCT */
function addProduct(){
  const p = {
    name: pname.value,
    price: price.value,
    mrp: mrp.value,
    min: min.value,
    unit: unit.value,
    img: img.value || "https://via.placeholder.com/300",
    stock: stock.checked
  };
  products.push(p);
  renderProducts();
  clearForm();
}

function clearForm(){
  pname.value="";
  price.value="";
  mrp.value="";
  min.value="";
  unit.value="";
  img.value="";
  stock.checked=true;
}

/* RENDER */
function renderProducts(){
  productsDiv.innerHTML="";
  products.forEach(p=>{
    productsDiv.innerHTML+=`
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <div class="price">
          <del>₹${p.mrp}</del> <b>₹${p.price}</b>
        </div>
        <p>Minimum: ${p.min} ${p.unit}</p>
        <p>${p.stock?"In stock ✅":"Out of stock ❌"}</p>
        <button onclick="addCart()">Add to Cart</button>
      </div>
    `;
  });
}

function addCart(){
  cart++;
  cartCount.innerText = cart;
}

function orderWhatsApp(){
  alert("WhatsApp order integration next step 🔥");
}
