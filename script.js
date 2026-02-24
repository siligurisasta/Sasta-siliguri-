const ADMIN_PASS = "1513";

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");

let tap = 0;
let timer = null;

logo.addEventListener("click", () => {
  tap++;
  clearTimeout(timer);
  timer = setTimeout(() => tap = 0, 800);

  if (tap === 3) {
    tap = 0;
    const pass = prompt("Enter admin password");

    if (pass === ADMIN_PASS) {
      admin.style.display = "block";
      admin.scrollIntoView({behavior:"smooth"});
      alert("Admin panel opened");
    } else {
      alert("Wrong password");
    }
  }
});

function addProduct(){
  alert("Product added (demo)");
}

function clearForm(){
  document.querySelectorAll(".admin input").forEach(i => i.value = "");
}
