const ADMIN_PASS = "1513";

document.addEventListener("DOMContentLoaded", () => {

  const logo = document.getElementById("logo");
  const admin = document.getElementById("admin");

  if (!logo || !admin) {
    alert("ID missing: logo / admin");
    return;
  }

  let tap = 0;
  let resetTimer = null;

  function handleTap(e) {
    e.preventDefault();

    tap++;

    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      tap = 0;
    }, 800);

    if (tap === 3) {
      tap = 0;

      const pass = prompt("Enter admin password");
      if (pass === ADMIN_PASS) {
        admin.style.display = "block";
        admin.scrollIntoView({ behavior: "smooth" });
        alert("Admin panel unlocked");
      } else {
        alert("Wrong password");
      }
    }
  }

  // Desktop + Mobile
  logo.addEventListener("click", handleTap);
  logo.addEventListener("touchstart", handleTap);

});
