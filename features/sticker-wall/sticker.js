import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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
const sharedWall = document.getElementById("sharedWall");

photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedImage.src = event.target.result;
    uploadedImage.classList.remove("hidden");
    makeDraggable(uploadedImage);
  };
  reader.readAsDataURL(file);
});

// Drag stickers
document.querySelectorAll(".sticker").forEach(sticker => {
  sticker.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", sticker.textContent);
  });
});

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

// Draggable
function makeDraggable(el) {
  el.style.position = "absolute";
  el.setAttribute("draggable", true);

  el.addEventListener("dragstart", (e) => {
    e.target.dataset.offsetX = e.offsetX;
    e.target.dataset.offsetY = e.offsetY;
    e.dataTransfer.setData("text/plain", "");
    e.dataTransfer.setDragImage(el, 20, 20);
  });

  el.addEventListener("dragend", (e) => {
    const rect = canvas.getBoundingClientRect();
    const offsetX = parseInt(e.target.dataset.offsetX || 0);
    const offsetY = parseInt(e.target.dataset.offsetY || 0);
    e.target.style.left = `${e.clientX - rect.left - offsetX}px`;
    e.target.style.top = `${e.clientY - rect.top - offsetY}px`;
  });
}

// Resizable
function makeResizable(el) {
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    const size = parseFloat(getComputedStyle(el).fontSize);
    const delta = e.deltaY < 0 ? 2 : -2;
    el.style.fontSize = `${Math.max(16, size + delta)}px`;
  });
}

// Save to localStorage
document.getElementById("saveDesignBtn").addEventListener("click", () => {
  localStorage.setItem("myStickerWall", canvas.innerHTML);
  alert("💾 Your design is saved locally!");
});

// Clear design
document.getElementById("clearBtn").addEventListener("click", () => {
  canvas.innerHTML = '<img id="uploadedImage" class="photo hidden" />';
  alert("🗑️ Canvas cleared!");
});

// Upload to Firebase
document.getElementById("submitToWallBtn").addEventListener("click", async () => {
  try {
    const snapshot = await html2canvas(canvas);
    const blob = await new Promise(res => snapshot.toBlob(res, "image/png"));
    const filename = `wall-${Date.now()}.png`;
    const storageRef = ref(storage, `shared/${filename}`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    alert("🎉 Added to shared wall!");
    addImageToWall(url);
  } catch (err) {
    alert("❌ Upload failed");
    console.error(err);
  }
});

// Load shared wall
async function loadSharedWall() {
  const listRef = ref(storage, "shared");
  const result = await listAll(listRef);

  result.items.forEach(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    addImageToWall(url);
  });
}

function addImageToWall(url) {
  const img = document.createElement("img");
  img.src = url;
  img.className = "shared-image";
  img.draggable = true;
  makeDraggable(img);
  sharedWall.appendChild(img);
}

// Load from local
function loadLocal() {
  const saved = localStorage.getItem("myStickerWall");
  if (saved) {
    canvas.innerHTML = saved;
    canvas.querySelectorAll(".placed-sticker").forEach(el => {
      makeDraggable(el);
      makeResizable(el);
    });
  }
}

loadSharedWall();
loadLocal();
