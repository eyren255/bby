import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAC3OBuV8LxNuP1WND-8mB8yqz_IgxzzNQ",
  authDomain: "honeybunapp-5f96e.firebaseapp.com",
  projectId: "honeybunapp-5f96e",
  storageBucket: "honeybunapp-5f96e.firebasestorage.app",
  messagingSenderId: "920031816754",
  appId: "1:920031816754:web:8ecbb7368afb284ec4602b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Get DOM elements
const wall = document.getElementById('wall');
const upload = document.getElementById('stickerUpload');

upload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const storageRef = ref(storage, 'stickers/' + file.name);

  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    createSticker(url, 50, 50);

    // Save to Firestore
    await addDoc(collection(db, 'stickers'), {
      src: url,
      x: 50,
      y: 50
    });
  } catch (err) {
    console.error('Upload failed:', err);
  }

  upload.value = '';
});

async function loadStickers() {
  const querySnapshot = await getDocs(collection(db, 'stickers'));
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    createSticker(data.src, data.x, data.y, docSnap.id);
  });
}

function createSticker(src, x = 50, y = 50, id = null) {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'sticker';
  img.style.position = 'absolute';
  img.style.left = x + 'px';
  img.style.top = y + 'px';
  img.style.width = '80px';
  img.style.cursor = 'move';

  wall.appendChild(img);

  let isDragging = false;
  let offsetX, offsetY;

  img.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - img.offsetLeft;
    offsetY = e.clientY - img.offsetTop;
    img.style.zIndex = 1000;
  });

  window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  let newX = e.clientX - offsetX;
  let newY = e.clientY - offsetY;

  img.style.left = newX + 'px';
  img.style.top = newY + 'px';
});

  window.addEventListener('mouseup', async () => {
    if (isDragging) {
      isDragging = false;
      img.style.zIndex = 1;

      if (id) {
        const docRef = doc(db, 'stickers', id);
        await setDoc(docRef, {
          src: img.src,
          x: parseFloat(img.style.left),
          y: parseFloat(img.style.top)
        });
      }
    }
  });
}

// Load stickers on page load
window.onload = loadStickers;
