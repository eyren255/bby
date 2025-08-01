// Simple sticker wall functionality without Firebase for now
// DOM Elements
const canvas = document.getElementById("canvas");
const photoInput = document.getElementById("photoInput");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const shareBtn = document.getElementById("shareBtn");
const viewWallBtn = document.getElementById("viewWallBtn");
const wallModal = document.getElementById("wallModal");
const closeModal = document.getElementById("closeModal");
const fullWall = document.getElementById("fullWall");
const wallCount = document.getElementById("wallCount");
const wallPreview = document.getElementById("wallPreview");
const textModal = document.getElementById("textModal");
const closeTextModal = document.getElementById("closeTextModal");
const textInput = document.getElementById("textInput");
const textColor = document.getElementById("textColor");
const textSize = document.getElementById("textSize");
const addTextBtn = document.getElementById("addTextBtn");

// State variables
let currentPhoto = null;
let currentFrame = 'none';
let selectedColor = '#ff6b9d';
let activeTool = null;
let isDrawing = false;
let drawingContext = null;

// Initialize the app
function initApp() {
  console.log('Initializing sticker wall app...');
  
  if (canvas && photoInput) {
    console.log('All elements found, setting up...');
    setupEventListeners();
    loadLocalDesign();
  } else {
    console.error('Required elements not found');
  }
}

// Setup all event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Photo upload
  if (photoInput) {
    console.log('Setting up photo upload...');
    photoInput.addEventListener("change", handlePhotoUpload);
    
    // Upload button click
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        console.log('Upload button clicked');
        photoInput.click();
      });
    }
  }
  
  // Action buttons
  if (saveBtn) saveBtn.addEventListener("click", saveDesign);
  if (clearBtn) clearBtn.addEventListener("click", clearCanvas);
  if (shareBtn) shareBtn.addEventListener("click", shareToWall);
  if (viewWallBtn) viewWallBtn.addEventListener("click", openWallModal);
  
  // Modal controls
  if (closeModal) closeModal.addEventListener("click", closeWallModal);
  if (closeTextModal) closeTextModal.addEventListener("click", closeTextModal);
  
  // Text tool
  if (addTextBtn) addTextBtn.addEventListener("click", addTextToCanvas);
  
  // Tool buttons
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => selectTool(btn.dataset.tool));
  });
  
  // Frame selection
  document.querySelectorAll('.frame-option').forEach(option => {
    option.addEventListener('click', () => selectFrame(option.dataset.frame));
  });
  
  // Color selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => selectColor(option.dataset.color));
  });
  
  // Sticker drag and drop
  document.querySelectorAll('.sticker-item').forEach(sticker => {
    sticker.addEventListener("dragstart", handleStickerDragStart);
  });
  
  // Canvas events
  if (canvas) {
    canvas.addEventListener("dragover", handleDragOver);
    canvas.addEventListener("drop", handleDrop);
    canvas.addEventListener("click", handleCanvasClick);
  }
  
  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === wallModal) closeWallModal();
    if (e.target === textModal) closeTextModal();
  });
}

// Handle photo upload
function handlePhotoUpload(e) {
  console.log('Photo upload event triggered');
  
  const file = e.target.files[0];
  if (!file) {
    console.log('No file selected');
    return;
  }
  
  console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file!');
    return;
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('File too large! Please select an image smaller than 10MB.');
    return;
  }
  
  playSound('uploadSound');
  
  const reader = new FileReader();
  reader.onload = (event) => {
    console.log('Photo loaded successfully, data length:', event.target.result.length);
    currentPhoto = event.target.result;
    displayPhoto();
  };
  
  reader.onerror = (error) => {
    console.error('Error reading file:', error);
    alert('Error uploading photo. Please try again.');
  };
  
  reader.readAsDataURL(file);
}

// Display uploaded photo
function displayPhoto() {
  console.log('Displaying photo...');
  
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  // Clear canvas
  canvas.innerHTML = '';
  
  const photoContainer = document.createElement('div');
  photoContainer.className = 'photo-container';
  photoContainer.style.position = 'relative';
  photoContainer.style.width = '100%';
  photoContainer.style.height = '100%';
  
  const img = document.createElement('img');
  img.src = currentPhoto;
  img.className = 'uploaded-photo';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'contain';
  img.style.borderRadius = '12px';
  
  img.onload = () => {
    console.log('Image loaded successfully');
  };
  
  img.onerror = () => {
    console.error('Error loading image');
    alert('Error loading image. Please try again.');
  };
  
  photoContainer.appendChild(img);
  canvas.appendChild(photoContainer);
  
  // Apply selected frame
  applyFrame(photoContainer);
  
  console.log('Photo displayed successfully');
}

// Apply frame to photo
function applyFrame(container) {
  const img = container.querySelector('.uploaded-photo');
  if (!img) return;
  
  // Remove existing frame classes
  img.className = 'uploaded-photo';
  
  // Apply new frame
  if (currentFrame !== 'none') {
    img.classList.add(`${currentFrame}-frame`);
  }
}

// Select tool
function selectTool(tool) {
  console.log('Selecting tool:', tool);
  
  // Remove active class from all tools
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to selected tool
  const selectedBtn = document.querySelector(`[data-tool="${tool}"]`);
  if (selectedBtn) {
    selectedBtn.classList.add('active');
  }
  
  activeTool = tool;
  
  // Handle specific tool actions
  switch(tool) {
    case 'text':
      openTextModal();
      break;
    case 'draw':
      setupDrawing();
      break;
    case 'sticker':
      // Stickers are handled by drag and drop
      break;
    case 'filter':
      applyFilter();
      break;
  }
}

// Select frame
function selectFrame(frame) {
  console.log('Selecting frame:', frame);
  
  // Remove selected class from all frames
  document.querySelectorAll('.frame-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  // Add selected class to chosen frame
  const selectedOption = document.querySelector(`[data-frame="${frame}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
  }
  
  currentFrame = frame;
  playSound('frameSound');
  
  // Apply frame to current photo
  const photoContainer = canvas.querySelector('.photo-container');
  if (photoContainer) {
    applyFrame(photoContainer);
  }
}

// Select color
function selectColor(color) {
  console.log('Selecting color:', color);
  
  // Remove selected class from all colors
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  // Add selected class to chosen color
  const selectedOption = document.querySelector(`[data-color="${color}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
  }
  
  selectedColor = color;
}

// Open text modal
function openTextModal() {
  if (textModal) {
    textModal.style.display = 'block';
    if (textInput) textInput.focus();
  }
}

// Close text modal
function closeTextModal() {
  if (textModal) {
    textModal.style.display = 'none';
    if (textInput) textInput.value = '';
  }
}

// Add text to canvas
function addTextToCanvas() {
  if (!textInput || !canvas) return;
  
  const text = textInput.value.trim();
  if (!text) return;
  
  const textElement = document.createElement('div');
  textElement.className = 'placed-element placed-text';
  textElement.textContent = text;
  textElement.style.color = selectedColor;
  textElement.style.fontSize = `${textSize ? textSize.value : 24}px`;
  textElement.style.left = '50%';
  textElement.style.top = '50%';
  textElement.style.transform = 'translate(-50%, -50%)';
  textElement.style.position = 'absolute';
  textElement.style.zIndex = '10';
  textElement.style.cursor = 'move';
  
  canvas.appendChild(textElement);
  makeDraggable(textElement);
  makeResizable(textElement);
  
  closeTextModal();
  playSound('uploadSound');
}

// Setup drawing
function setupDrawing() {
  if (!currentPhoto) {
    alert('Please upload a photo first!');
    return;
  }
  
  const drawingCanvas = document.createElement('canvas');
  drawingCanvas.width = 800;
  drawingCanvas.height = 600;
  drawingCanvas.style.position = 'absolute';
  drawingCanvas.style.top = '0';
  drawingCanvas.style.left = '0';
  drawingCanvas.style.pointerEvents = 'auto';
  drawingCanvas.style.zIndex = '5';
  
  drawingContext = drawingCanvas.getContext('2d');
  drawingContext.strokeStyle = selectedColor;
  drawingContext.lineWidth = 3;
  drawingContext.lineCap = 'round';
  
  drawingCanvas.addEventListener('mousedown', startDrawing);
  drawingCanvas.addEventListener('mousemove', draw);
  drawingCanvas.addEventListener('mouseup', stopDrawing);
  drawingCanvas.addEventListener('mouseout', stopDrawing);
  
  const photoContainer = canvas.querySelector('.photo-container');
  if (photoContainer) {
    photoContainer.appendChild(drawingCanvas);
  }
}

// Drawing functions
function startDrawing(e) {
  isDrawing = true;
  const rect = e.target.getBoundingClientRect();
  drawingContext.beginPath();
  drawingContext.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
  if (!isDrawing) return;
  const rect = e.target.getBoundingClientRect();
  drawingContext.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  drawingContext.stroke();
}

function stopDrawing() {
  isDrawing = false;
}

// Apply filter
function applyFilter() {
  const img = document.querySelector('.uploaded-photo');
  if (!img) return;
  
  const filters = ['none', 'grayscale', 'sepia', 'blur', 'brightness'];
  const currentFilter = img.style.filter || 'none';
  const currentIndex = filters.indexOf(currentFilter);
  const nextIndex = (currentIndex + 1) % filters.length;
  
  switch(filters[nextIndex]) {
    case 'grayscale':
      img.style.filter = 'grayscale(100%)';
      break;
    case 'sepia':
      img.style.filter = 'sepia(100%)';
      break;
    case 'blur':
      img.style.filter = 'blur(2px)';
      break;
    case 'brightness':
      img.style.filter = 'brightness(1.2)';
      break;
    default:
      img.style.filter = 'none';
  }
}

// Handle sticker drag start
function handleStickerDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.textContent);
  e.dataTransfer.setData("type", "sticker");
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault();
}

// Handle drop
function handleDrop(e) {
  e.preventDefault();
  
  const type = e.dataTransfer.getData("type");
  const data = e.dataTransfer.getData("text/plain");
  
  if (type === "sticker") {
    addSticker(data, e.clientX, e.clientY);
  }
}

// Add sticker to canvas
function addSticker(emoji, clientX, clientY) {
  if (!canvas) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  
  const sticker = document.createElement('div');
  sticker.className = 'placed-element placed-sticker';
  sticker.textContent = emoji;
  sticker.style.left = `${x}px`;
  sticker.style.top = `${y}px`;
  sticker.style.position = 'absolute';
  sticker.style.zIndex = '10';
  sticker.style.cursor = 'move';
  sticker.style.fontSize = '24px';
  
  canvas.appendChild(sticker);
  makeDraggable(sticker);
  makeResizable(sticker);
  
  playSound('uploadSound');
}

// Make element draggable
function makeDraggable(element) {
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;
  
  element.addEventListener('mousedown', dragStart);
  element.addEventListener('mousemove', drag);
  element.addEventListener('mouseup', dragEnd);
  element.addEventListener('mouseleave', dragEnd);
  
  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    
    if (e.target === element) {
      isDragging = true;
    }
  }
  
  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      
      xOffset = currentX;
      yOffset = currentY;
      
      setTranslate(currentX, currentY, element);
    }
  }
  
  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }
  
  function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }
}

// Make element resizable
function makeResizable(element) {
  element.addEventListener('wheel', (e) => {
    e.preventDefault();
    const currentSize = parseFloat(getComputedStyle(element).fontSize);
    const delta = e.deltaY < 0 ? 2 : -2;
    const newSize = Math.max(12, Math.min(100, currentSize + delta));
    element.style.fontSize = `${newSize}px`;
  });
}

// Save design locally
function saveDesign() {
  if (!canvas) return;
  
  const designData = {
    photo: currentPhoto,
    frame: currentFrame,
    elements: []
  };
  
  // Save placed elements
  canvas.querySelectorAll('.placed-element').forEach(element => {
    const elementData = {
      type: element.classList.contains('placed-text') ? 'text' : 'sticker',
      content: element.textContent,
      style: {
        left: element.style.left,
        top: element.style.top,
        fontSize: element.style.fontSize,
        color: element.style.color,
        transform: element.style.transform
      }
    };
    designData.elements.push(elementData);
  });
  
  localStorage.setItem('creativeWallDesign', JSON.stringify(designData));
  showMessage('💾 Design saved locally!');
  playSound('uploadSound');
}

// Clear canvas
function clearCanvas() {
  if (!canvas) return;
  
  if (confirm('Are you sure you want to clear the canvas?')) {
    canvas.innerHTML = '<div class="canvas-placeholder"><div class="placeholder-icon">📷</div><p>Upload a photo to start creating!</p></div>';
    currentPhoto = null;
    showMessage('🗑️ Canvas cleared!');
  }
}

// Load local design
function loadLocalDesign() {
  const saved = localStorage.getItem('creativeWallDesign');
  if (saved) {
    try {
      const designData = JSON.parse(saved);
      currentPhoto = designData.photo;
      currentFrame = designData.frame;
      
      if (currentPhoto) {
        displayPhoto();
        
        // Restore elements
        designData.elements.forEach(elementData => {
          const element = document.createElement('div');
          element.className = `placed-element ${elementData.type === 'text' ? 'placed-text' : 'placed-sticker'}`;
          element.textContent = elementData.content;
          
          Object.assign(element.style, elementData.style);
          element.style.position = 'absolute';
          element.style.zIndex = '10';
          element.style.cursor = 'move';
          
          canvas.appendChild(element);
          makeDraggable(element);
          makeResizable(element);
        });
      }
    } catch (error) {
      console.error('Error loading saved design:', error);
    }
  }
}

// Share to wall (simplified without Firebase)
function shareToWall() {
  if (!currentPhoto) {
    alert('Please upload a photo first!');
    return;
  }
  
  showMessage('🎉 Design ready to share! (Firebase integration coming soon)');
  playSound('frameSound');
}

// Open wall modal
function openWallModal() {
  if (wallModal) {
    wallModal.style.display = 'block';
    loadFullWall();
  }
}

// Close wall modal
function closeWallModal() {
  if (wallModal) {
    wallModal.style.display = 'none';
  }
}

// Load full wall (simplified)
function loadFullWall() {
  if (!fullWall) return;
  
  fullWall.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;"><h3>🎨 Shared Wall</h3><p>Firebase integration coming soon!</p><p>Your shared creations will appear here.</p></div>';
}

// Handle canvas click
function handleCanvasClick(e) {
  if (activeTool === 'draw' && currentPhoto) {
    setupDrawing();
  }
}

// Show message
function showMessage(text) {
  const message = document.createElement('div');
  message.className = 'message-popup';
  message.textContent = text;
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 107, 157, 0.9);
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-weight: bold;
    z-index: 10000;
    animation: messagePop 0.5s ease;
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
  }, 2000);
}

// Play sound
function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {
      // Ignore autoplay restrictions
    });
  }
}

// Add message pop animation
const style = document.createElement('style');
style.textContent = `
  @keyframes messagePop {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Add global test functions for debugging
window.testStickerWall = {
  uploadPhoto: () => {
    console.log('Manual photo upload test');
    if (photoInput) {
      photoInput.click();
    } else {
      console.error('Photo input not found');
    }
  },
  checkElements: () => {
    console.log('Checking elements...');
    console.log('Canvas:', !!canvas);
    console.log('Photo input:', !!photoInput);
    console.log('Upload button:', !!document.querySelector('.upload-btn'));
    console.log('Save button:', !!saveBtn);
    console.log('Clear button:', !!clearBtn);
  },
  addTestSticker: () => {
    if (canvas) {
      addSticker('🎉', 100, 100);
      console.log('Test sticker added');
    }
  }
};
