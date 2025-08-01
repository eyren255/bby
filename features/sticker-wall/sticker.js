const photoInput = document.getElementById('photoInput');
const uploadedImage = document.getElementById('uploadedImage');
const canvas = document.getElementById('canvas');

// Handle Photo Upload
photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    uploadedImage.src = event.target.result;
    uploadedImage.classList.remove('hidden');
    document.querySelector('.placeholder-text')?.remove();
  };
  reader.readAsDataURL(file);
});

// Drag and Drop Stickers
const stickers = document.querySelectorAll('.sticker');

stickers.forEach(sticker => {
  sticker.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', sticker.textContent);
  });
});

canvas.addEventListener('dragover', (e) => {
  e.preventDefault(); // Allow drop
});

canvas.addEventListener('drop', (e) => {
  e.preventDefault();
  const emoji = e.dataTransfer.getData('text/plain');

  const newSticker = document.createElement('div');
  newSticker.className = 'placed-sticker';
  newSticker.textContent = emoji;

  // Position relative to canvas
  const rect = canvas.getBoundingClientRect();
  newSticker.style.left = `${e.clientX - rect.left - 20}px`;
  newSticker.style.top = `${e.clientY - rect.top - 20}px`;

  // Make the sticker draggable after placing
  newSticker.setAttribute('draggable', 'true');
  newSticker.addEventListener('dragstart', (dragEvent) => {
    dragEvent.dataTransfer.setData('text/plain', 'move');
    dragEvent.dataTransfer.setDragImage(newSticker, 20, 20);
    dragEvent.target.classList.add('dragging');
  });

  newSticker.addEventListener('dragend', (dragEvent) => {
    dragEvent.target.classList.remove('dragging');
  });

  canvas.appendChild(newSticker);
});
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

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

// Save Wall Button
const saveBtn = document.getElementById("saveWallBtn");

saveBtn.addEventListener("click", async () => {
  const canvasArea = document.getElementById("canvas");
  saveBtn.textContent = "Saving...";

  try {
    const canvasImage = await html2canvas(canvasArea);
    const blob = await new Promise(resolve => canvasImage.toBlob(resolve, 'image/png'));

    const filename = `wall-${Date.now()}.png`;
    const storageRef = ref(storage, 'walls/' + filename);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    alert("🎉 Your wall is saved!");
    console.log("File URL:", downloadURL);
  } catch (err) {
    console.error("Save failed:", err);
    alert("Oops! Something went wrong.");
  }

  saveBtn.textContent = "💾 Save My Wall";
});
