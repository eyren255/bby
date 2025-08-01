// password.js
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("passwordModal");
  const input = document.getElementById("passwordInput");
  const btn = document.getElementById("submitPassword");
  const menu = document.querySelector(".menu");

  const correctPassword = "iloveyouhoneybun";

  // ✅ Immediately unlock if already authenticated
  if (localStorage.getItem("unlocked") === "true") {
    modal.style.display = "none";
    menu.style.display = "block";
    return;
  }

  btn?.addEventListener("click", () => {
    if (input.value === correctPassword) {
      alert("Welcome, Honey Bun 💖");
      modal.style.display = "none";
      menu.style.display = "block";
      localStorage.setItem("unlocked", "true");
    } else {
      alert("Oops! Try again.");
    }
  });
});
