const ADMIN_PASS = "1513";

let tapCount = 0;
let tapTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");
  const admin = document.getElementById("admin");

  // admin default hidden
  admin.style.display = "none";

  function handleTap() {
    tapCount++;
    clearTimeout(tapTimer);

    tapTimer = setTimeout(() => {
      tapCount = 0;
    }, 700);

    if (tapCount === 3) {
      tapCount = 0;
      const pass = prompt("Enter admin password");
      if (pass === ADMIN_PASS) {
        admin.style.display = "block";
        admin.scrollIntoView({ behavior: "smooth" });
      } else {
        alert("Wrong password");
      }
    }
  }

  logo.addEventListener("click", handleTap);
  logo.addEventListener("touchstart", handleTap);
});
