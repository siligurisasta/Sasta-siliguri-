const ADMIN_PASS = "1513";

let tap = 0;
let timer = null;

const logo = document.getElementById("logo");
const admin = document.getElementById("admin");

logo.addEventListener("click", () => {
  tap++;
  clearTimeout(timer);
  timer = setTimeout(() => tap = 0, 1000);

  if(tap === 3){
    tap = 0;
    const p = prompt("Enter admin password");
    if(p === ADMIN_PASS){
      admin.style.display = "block";
      alert("Admin panel opened");
    }else{
      alert("Wrong password");
    }
  }
});
