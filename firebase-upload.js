// firebase-upload.js
import { storage } from "./firebase.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("photoUpload");
  const preview = document.getElementById("photoPreview");

  const path = localStorage.getItem("userPhotoPath");
  if (path && preview) {
    getDownloadURL(ref(storage, path)).then(url => {
      preview.src = url;
      preview.style.display = "block";
    });
  }

  fileInput?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileRef = ref(storage, `user-uploads/${file.name}`);
    await uploadBytes(fileRef, file);
    localStorage.setItem("userPhotoPath", `user-uploads/${file.name}`);

    const url = await getDownloadURL(fileRef);
    preview.src = url;
    preview.style.display = "block";
  });
});
