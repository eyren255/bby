// sticker.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAC3OBuV8LxNuP1WND-8mB8yqz_IgxzzNQ",
  authDomain: "honeybunapp-5f96e.firebaseapp.com",
  projectId: "honeybunapp-5f96e",
  storageBucket: "honeybunapp-5f96e.appspot.com",
  messagingSenderId: "920031816754",
  appId: "1:920031816754:web:8ecbb7368afb284ec4602b"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const canvas = document.getElementById("canvas");
const photoInput = document.getElementById("photoInput");
const uploadedImage = document.getElementById("uploadedImage");

// Upload photo
photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedImage.src = event.target.result;
    uploadedImage.classList.remove("hidden");
    uploadedImage.classList.add("pop-in");
    document.querySelector(".placeholder-text")?.remove();

    // Enable photo dragging
    makeDraggable(uploadedImage);
  };
  reader.readAsDataURL(file);
});

// Drag sticker from bar
document.querySelectorAll(".sticker").forEach(sticker => {
  sticker.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", sticker.textContent);
  });
});

// Drop sticker
canvas.addEventListener("dragover", (e) => e.preventDefault());
canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const emoji = e.dataTransfer.getData("text/plain");
  const rect = canvas.getBoundingClientRect();

  const newSticker = document.createElement("div");
  newSticker.className = "placed-sticker";
  newSticker.textContent = emoji;
  newSticker.style.left = `${e.clientX - rect.left - 20}px`;
  newSticker.style.top = `${e.clientY - rect.top - 20}px`;

  canvas.appendChild(newSticker);
  makeDraggable(newSticker);
  makeResizable(newSticker);
});

// Make element draggable inside canvas
function makeDraggable(el) {
  el.style.position = "absolute";
  el.setAttribute("draggable", true);

  el.addEventListener("dragstart", (e) => {
    e.target.dataset.offsetX = e.offsetX;
    e.target.dataset.offsetY = e.offsetY;

    // Prevent "move" label
    e.dataTransfer.setData("text/plain", "");
    e.dataTransfer.setDragImage(el, 20, 20); // shows the element itself
  });

  el.addEventListener("dragend", (e) => {
    const rect = canvas.getBoundingClientRect();
    const offsetX = parseInt(e.target.dataset.offsetX || 0);
    const offsetY = parseInt(e.target.dataset.offsetY || 0);
    e.target.style.left = `${e.clientX - rect.left - offsetX}px`;
    e.target.style.top = `${e.clientY - rect.top - offsetY}px`;
  });
}


// Resize with scroll
function makeResizable(el) {
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    const current = parseFloat(getComputedStyle(el).fontSize);
    const change = e.deltaY < 0 ? 2 : -2;
    el.style.fontSize = `${Math.max(16, current + change)}px`;
  });
}

// Save to Firebase
document.getElementById("saveWallBtn").addEventListener("click", async () => {
  const btn = document.getElementById("saveWallBtn");
  btn.textContent = "Saving...";

  try {
    const snapshot = await html2canvas(canvas);
    const blob = await new Promise(res => snapshot.toBlob(res, "image/png"));
    const filename = `wall-${Date.now()}.png`;
    const storageRef = ref(storage, `walls/${filename}`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    alert("🎉 Saved! Link copied to clipboard.");
    navigator.clipboard.writeText(url);
  } catch (err) {
    alert("💔 Oops! Something went wrong.");
    console.error(err);
  }

  btn.textContent = "💾 Save My Wall";
});

// Download Image
document.getElementById("downloadBtn").addEventListener("click", async () => {
  const snapshot = await html2canvas(canvas);
  const link = document.createElement("a");
  link.download = `sticker-wall-${Date.now()}.png`;
  link.href = snapshot.toDataURL("image/png");
  link.click();
});
