// Creative Studio - Enhanced Sticker Wall
// Advanced photo editing and creative tools

// Import Fabric.js for advanced canvas manipulation
let fabricCanvas = null;

// DOM Elements
const canvas = document.getElementById("canvas");
const photoInput = document.getElementById("photoInput");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const shareBtn = document.getElementById("shareBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const cropBtn = document.getElementById("cropBtn");
const rotateBtn = document.getElementById("rotateBtn");
const flipBtn = document.getElementById("flipBtn");
const zoomBtn = document.getElementById("zoomBtn");
const cameraBtn = document.getElementById("cameraBtn");
const urlBtn = document.getElementById("urlBtn");
const sampleBtn = document.getElementById("sampleBtn");
const customColor = document.getElementById("customColor");

// Modal elements
const textModal = document.getElementById("textModal");
const urlModal = document.getElementById("urlModal");
const exportModal = document.getElementById("exportModal");
const sampleModal = document.getElementById("sampleModal");
const closeTextModal = document.getElementById("closeTextModal");
const closeUrlModal = document.getElementById("closeUrlModal");
const closeExportModal = document.getElementById("closeExportModal");
const closeSampleModal = document.getElementById("closeSampleModal");

// Text modal elements
const textInput = document.getElementById("textInput");
const textColor = document.getElementById("textColor");
const textSize = document.getElementById("textSize");
const textFont = document.getElementById("textFont");
const addTextBtn = document.getElementById("addTextBtn");
const effectBtns = document.querySelectorAll('.effect-btn');

// URL modal elements
const urlInput = document.getElementById("urlInput");
const loadUrlBtn = document.getElementById("loadUrlBtn");

// Export modal elements
const exportFormat = document.getElementById("exportFormat");
const exportQuality = document.getElementById("exportQuality");
const exportSize = document.getElementById("exportSize");
const qualityValue = document.getElementById("qualityValue");
const exportBtn = document.getElementById("exportBtn");

// Gallery elements
const recentCreations = document.getElementById("recentCreations");
const templateItems = document.querySelectorAll('.template-item');
const sampleItems = document.querySelectorAll('.sample-item');

// Statistics elements
const photoCount = document.getElementById("photoCount");
const stickerCount = document.getElementById("stickerCount");
const saveCount = document.getElementById("saveCount");
const totalPhotos = document.getElementById("totalPhotos");
const totalStickers = document.getElementById("totalStickers");
const totalSaves = document.getElementById("totalSaves");
const sessionTime = document.getElementById("sessionTime");
const canvasInfo = document.getElementById("canvasInfo");

// Canvas tools
const canvasTools = document.getElementById("canvasTools");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const resetZoomBtn = document.getElementById("resetZoomBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

// State variables
let currentPhoto = null;
let currentFrame = 'none';
let selectedColor = '#ff6b9d';
let activeTool = null;
let isDrawing = false;
let drawingContext = null;
let canvasZoom = 1;
let sessionStartTime = Date.now();
let undoStack = [];
let redoStack = [];
let statistics = {
  photos: 0,
  stickers: 0,
  saves: 0,
  sessionMinutes: 0
};

// Sticker categories data
const stickerCategories = {
  love: ['💖', '💕', '💝', '💗', '💓', '💞', '💟', '💌', '💋', '💍', '🌹', '🌺'],
  nature: ['🌿', '🌸', '🌺', '🌹', '🌷', '🌻', '🌼', '🌾', '🍃', '🌱', '🌲', '🌳'],
  food: ['🍕', '🍔', '🍟', '🌭', '🍿', '🍩', '🍪', '🍰', '🍦', '🍧', '🍨', '🍩'],
  animals: ['🐰', '🐱', '🐶', '🐼', '🐨', '🐯', '🦁', '🐸', '🐙', '🦄', '🦋', '🐞'],
  objects: ['🎁', '🎈', '🎀', '🎊', '🎉', '✨', '💎', '🔮', '🎭', '🎪', '🎨', '🎭']
};

// Initialize the app
function initApp() {
  console.log('🎨 Initializing Creative Studio...');
  
  if (canvas && photoInput) {
    console.log('✅ All elements found, setting up...');
    setupFabricCanvas();
    setupEventListeners();
    loadLocalDesign();
    loadStatistics();
    startSessionTimer();
    updateCanvasInfo('Ready to create! 🎨');
  } else {
    console.error('❌ Required elements not found');
  }
}

// Setup Fabric.js canvas
function setupFabricCanvas() {
  fabricCanvas = new fabric.Canvas('canvas', {
    width: canvas.offsetWidth,
    height: canvas.offsetHeight,
    backgroundColor: 'transparent'
  });
  
  console.log('✅ Fabric.js canvas initialized');
}

// Setup all event listeners
function setupEventListeners() {
  console.log('🔧 Setting up event listeners...');
  
  // Photo upload
  if (photoInput) {
    photoInput.addEventListener("change", handlePhotoUpload);
    
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
        console.log('📷 Upload button clicked');
        photoInput.click();
      });
    }
  }
  
  // Quick action buttons
  if (cameraBtn) cameraBtn.addEventListener("click", openCamera);
  if (urlBtn) urlBtn.addEventListener("click", openUrlModal);
  if (sampleBtn) sampleBtn.addEventListener("click", openSampleModal);
  
  // Action buttons
  if (saveBtn) saveBtn.addEventListener("click", saveDesign);
  if (clearBtn) clearBtn.addEventListener("click", clearCanvas);
  if (shareBtn) shareBtn.addEventListener("click", shareToWall);
  if (exportBtn) exportBtn.addEventListener("click", openExportModal);
  
  // Advanced tools
  if (undoBtn) undoBtn.addEventListener("click", undoAction);
  if (redoBtn) redoBtn.addEventListener("click", redoAction);
  if (cropBtn) cropBtn.addEventListener("click", cropImage);
  if (rotateBtn) rotateBtn.addEventListener("click", rotateImage);
  if (flipBtn) flipBtn.addEventListener("click", flipImage);
  if (zoomBtn) zoomBtn.addEventListener("click", toggleZoomTools);
  
  // Canvas tools
  if (zoomInBtn) zoomInBtn.addEventListener("click", zoomIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener("click", zoomOut);
  if (resetZoomBtn) resetZoomBtn.addEventListener("click", resetZoom);
  if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);
  
  // Modal controls
  if (closeTextModal) closeTextModal.addEventListener("click", closeTextModal);
  if (closeUrlModal) closeUrlModal.addEventListener("click", closeUrlModal);
  if (closeExportModal) closeExportModal.addEventListener("click", closeExportModal);
  if (closeSampleModal) closeSampleModal.addEventListener("click", closeSampleModal);
  
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
  
  // Custom color picker
  if (customColor) {
    customColor.addEventListener("change", (e) => {
      selectColor(e.target.value);
    });
  }
  
  // Sticker categories
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => switchStickerCategory(btn.dataset.category));
  });
  
  // Sticker drag and drop
  document.querySelectorAll('.sticker-item').forEach(sticker => {
    sticker.addEventListener("dragstart", handleStickerDragStart);
  });
  
  // Template items
  templateItems.forEach(item => {
    item.addEventListener('click', () => applyTemplate(item.dataset.template));
  });
  
  // Sample items
  sampleItems.forEach(item => {
    item.addEventListener('click', () => loadSamplePhoto(item.dataset.sample));
  });
  
  // Text effects
  effectBtns.forEach(btn => {
    btn.addEventListener('click', () => toggleTextEffect(btn.dataset.effect));
  });
  
  // Export options
  if (exportQuality) {
    exportQuality.addEventListener('input', (e) => {
      qualityValue.textContent = Math.round(e.target.value * 100) + '%';
    });
  }
  
  if (exportBtn) exportBtn.addEventListener("click", exportImage);
  
  // URL modal
  if (loadUrlBtn) loadUrlBtn.addEventListener("click", loadImageFromUrl);
  
  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  console.log('✅ All event listeners set up');
}

// Handle photo upload
function handlePhotoUpload(e) {
  console.log('📸 Photo upload event triggered');
  
  const file = e.target.files[0];
  if (!file) {
    console.log('❌ No file selected');
    return;
  }
  
  console.log('📁 File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    showMessage('❌ Please select an image file!');
    return;
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    showMessage('❌ File too large! Please select an image smaller than 10MB.');
    return;
  }
  
  playSound('uploadSound');
  
  const reader = new FileReader();
  reader.onload = (event) => {
    console.log('✅ Photo loaded successfully, data length:', event.target.result.length);
    currentPhoto = event.target.result;
    displayPhoto();
    updateStatistics('photos');
    updateCanvasInfo('Photo uploaded! 🎉');
  };
  
  reader.onerror = (error) => {
    console.error('❌ Error reading file:', error);
    showMessage('❌ Error uploading photo. Please try again.');
  };
  
  reader.readAsDataURL(file);
}

// Display uploaded photo
function displayPhoto() {
  console.log('🖼️ Displaying photo...');
  
  if (!fabricCanvas) {
    console.error('❌ Fabric canvas not initialized');
    return;
  }
  
  // Clear canvas
  fabricCanvas.clear();
  
  // Load image into Fabric.js
  fabric.Image.fromURL(currentPhoto, (img) => {
    // Scale image to fit canvas
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
    
    img.scale(scale);
    img.set({
      left: (canvasWidth - img.width * scale) / 2,
      top: (canvasHeight - img.height * scale) / 2
    });
    
    fabricCanvas.add(img);
    fabricCanvas.renderAll();
    
    console.log('✅ Photo displayed successfully');
    showMessage('Photo uploaded! 🎉');
  }, { crossOrigin: 'anonymous' });
}

// Apply frame to photo
function applyFrame(frameType) {
  if (!fabricCanvas || !currentPhoto) return;
  
  const objects = fabricCanvas.getObjects();
  const photo = objects.find(obj => obj.type === 'image');
  
  if (!photo) return;
  
  // Remove existing frame
  photo.set('stroke', null);
  photo.set('strokeWidth', 0);
  
  // Apply new frame
  switch (frameType) {
    case 'hearts':
      photo.set('stroke', '#ff6b9d');
      photo.set('strokeWidth', 20);
      break;
    case 'flowers':
      photo.set('stroke', '#ff8fab');
      photo.set('strokeWidth', 20);
      break;
    case 'stars':
      photo.set('stroke', '#ffd700');
      photo.set('strokeWidth', 20);
      break;
    case 'vintage':
      photo.set('stroke', '#8B4513');
      photo.set('strokeWidth', 15);
      break;
    case 'polaroid':
      photo.set('stroke', '#ffffff');
      photo.set('strokeWidth', 20);
      break;
    case 'crystal':
      photo.set('stroke', '#00ffff');
      photo.set('strokeWidth', 25);
      break;
    case 'magic':
      photo.set('stroke', '#9932cc');
      photo.set('strokeWidth', 25);
      break;
  }
  
  fabricCanvas.renderAll();
  showMessage('Frame applied! ✨');
}

// Select tool
function selectTool(tool) {
  activeTool = tool;
  
  // Update UI
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`[data-tool="${tool}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  // Setup tool functionality
  switch (tool) {
    case 'text':
      openTextModal();
      break;
    case 'draw':
      setupDrawing();
      break;
    case 'shape':
      addShape();
      break;
    case 'effect':
      applyEffect();
      break;
  }
  
  console.log('🎨 Tool selected:', tool);
}

// Select frame
function selectFrame(frame) {
  currentFrame = frame;
  
  // Update UI
  document.querySelectorAll('.frame-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  const selectedOption = document.querySelector(`[data-frame="${frame}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
  }
  
  applyFrame(frame);
}

// Select color
function selectColor(color) {
  selectedColor = color;
  
  // Update UI
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  const selectedOption = document.querySelector(`[data-color="${color}"]`);
  if (selectedOption) {
    selectedOption.classList.add('selected');
  }
  
  console.log('🎨 Color selected:', color);
}

// Switch sticker category
function switchStickerCategory(category) {
  const stickerGrid = document.querySelector('.sticker-grid');
  if (!stickerGrid) return;
  
  // Update category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`[data-category="${category}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  // Update sticker grid
  const stickers = stickerCategories[category] || [];
  stickerGrid.innerHTML = stickers.map(sticker => 
    `<div class="sticker-item" draggable="true" data-sticker="${sticker}">${sticker}</div>`
  ).join('');
  
  // Re-attach drag events
  document.querySelectorAll('.sticker-item').forEach(sticker => {
    sticker.addEventListener("dragstart", handleStickerDragStart);
  });
}

// Handle sticker drag start
function handleStickerDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.sticker);
  console.log('🎯 Sticker drag started:', e.target.dataset.sticker);
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault();
}

// Handle drop
function handleDrop(e) {
  e.preventDefault();
  
  const sticker = e.dataTransfer.getData('text/plain');
  if (sticker) {
    addSticker(sticker, e.offsetX, e.offsetY);
  }
}

// Add sticker to canvas
function addSticker(sticker, x, y) {
  if (!fabricCanvas) return;
  
  const text = new fabric.Text(sticker, {
    left: x,
    top: y,
    fontSize: 40,
    fill: selectedColor,
    selectable: true,
    draggable: true
  });
  
  fabricCanvas.add(text);
  fabricCanvas.renderAll();
  
  updateStatistics('stickers');
  showMessage('Sticker added! 🎯');
}

// Add text to canvas
function addTextToCanvas() {
  if (!fabricCanvas) return;
  
  const text = textInput.value.trim();
  if (!text) {
    showMessage('Please enter some text! 📝');
    return;
  }
  
  const fontSize = parseInt(textSize.value);
  const fontFamily = textFont.value;
  
  const fabricText = new fabric.Text(text, {
    left: fabricCanvas.getWidth() / 2,
    top: fabricCanvas.getHeight() / 2,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fill: selectedColor,
    selectable: true,
    draggable: true
  });
  
  // Apply text effects
  if (document.querySelector('.effect-btn[data-effect="bold"].active')) {
    fabricText.set('fontWeight', 'bold');
  }
  if (document.querySelector('.effect-btn[data-effect="italic"].active')) {
    fabricText.set('fontStyle', 'italic');
  }
  if (document.querySelector('.effect-btn[data-effect="underline"].active')) {
    fabricText.set('underline', true);
  }
  if (document.querySelector('.effect-btn[data-effect="shadow"].active')) {
    fabricText.set('shadow', '2px 2px 4px rgba(0,0,0,0.5)');
  }
  if (document.querySelector('.effect-btn[data-effect="outline"].active')) {
    fabricText.set('stroke', '#000000');
    fabricText.set('strokeWidth', 1);
  }
  
  fabricCanvas.add(fabricText);
  fabricCanvas.renderAll();
  
  closeTextModal();
  textInput.value = '';
  showMessage('Text added! ✍️');
}

// Add shape
function addShape() {
  if (!fabricCanvas) return;
  
  const shape = new fabric.Circle({
    left: fabricCanvas.getWidth() / 2,
    top: fabricCanvas.getHeight() / 2,
    radius: 50,
    fill: selectedColor,
    selectable: true,
    draggable: true
  });
  
  fabricCanvas.add(shape);
  fabricCanvas.renderAll();
  
  showMessage('Shape added! 🔷');
}

// Apply effect
function applyEffect() {
  if (!fabricCanvas) return;
  
  const activeObject = fabricCanvas.getActiveObject();
  if (!activeObject) {
    showMessage('Select an object first! 🎯');
    return;
  }
  
  // Apply random effect
  const effects = ['blur', 'brightness', 'contrast', 'saturation'];
  const effect = effects[Math.floor(Math.random() * effects.length)];
  
  switch (effect) {
    case 'blur':
      activeObject.set('blur', 2);
      break;
    case 'brightness':
      activeObject.set('brightness', 1.2);
      break;
    case 'contrast':
      activeObject.set('contrast', 1.3);
      break;
    case 'saturation':
      activeObject.set('saturation', 1.5);
      break;
  }
  
  fabricCanvas.renderAll();
  showMessage(`Effect applied: ${effect}! ✨`);
}

// Setup drawing
function setupDrawing() {
  if (!fabricCanvas) return;
  
  fabricCanvas.isDrawingMode = true;
  fabricCanvas.freeDrawingBrush.width = 5;
  fabricCanvas.freeDrawingBrush.color = selectedColor;
  
  showMessage('Drawing mode activated! 🎨');
}

// Camera functionality
function openCamera() {
  showMessage('Camera feature coming soon! 📷');
}

// URL modal functions
function openUrlModal() {
  if (urlModal) urlModal.style.display = 'block';
}

function closeUrlModal() {
  if (urlModal) urlModal.style.display = 'none';
}

function loadImageFromUrl() {
  const url = urlInput.value.trim();
  if (!url) {
    showMessage('Please enter a valid URL! 🌐');
    return;
  }
  
  fabric.Image.fromURL(url, (img) => {
    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();
    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
    
    img.scale(scale);
    img.set({
      left: (canvasWidth - img.width * scale) / 2,
      top: (canvasHeight - img.height * scale) / 2
    });
    
    fabricCanvas.add(img);
    fabricCanvas.renderAll();
    
    closeUrlModal();
    showMessage('Image loaded from URL! 🌐');
  }, { crossOrigin: 'anonymous' });
}

// Sample modal functions
function openSampleModal() {
  if (sampleModal) sampleModal.style.display = 'block';
}

function closeSampleModal() {
  if (sampleModal) sampleModal.style.display = 'none';
}

function loadSamplePhoto(sample) {
  const sampleUrls = {
    'nature': 'https://picsum.photos/400/300?nature',
    'city': 'https://picsum.photos/400/300?city',
    'people': 'https://picsum.photos/400/300?people',
    'abstract': 'https://picsum.photos/400/300?abstract'
  };
  
  const url = sampleUrls[sample];
  if (url) {
    loadImageFromUrl(url);
    closeSampleModal();
  }
}

// Export modal functions
function openExportModal() {
  if (exportModal) exportModal.style.display = 'block';
}

function closeExportModal() {
  if (exportModal) exportModal.style.display = 'none';
}

function exportImage() {
  if (!fabricCanvas) return;
  
  const format = exportFormat.value;
  const quality = parseFloat(exportQuality.value);
  const size = exportSize.value;
  
  let dataURL = fabricCanvas.toDataURL({
    format: format,
    quality: quality
  });
  
  // Create download link
  const link = document.createElement('a');
  link.download = `creative-studio-${Date.now()}.${format}`;
  link.href = dataURL;
  link.click();
  
  closeExportModal();
  showMessage('Image exported! 📤');
}

// Text modal functions
function openTextModal() {
  if (textModal) textModal.style.display = 'block';
}

function closeTextModal() {
  if (textModal) textModal.style.display = 'none';
}

function toggleTextEffect(effect) {
  const btn = document.querySelector(`[data-effect="${effect}"]`);
  if (btn) {
    btn.classList.toggle('active');
  }
}

// Canvas tools
function zoomIn() {
  if (fabricCanvas) {
    fabricCanvas.setZoom(fabricCanvas.getZoom() * 1.2);
    fabricCanvas.renderAll();
  }
}

function zoomOut() {
  if (fabricCanvas) {
    fabricCanvas.setZoom(fabricCanvas.getZoom() / 1.2);
    fabricCanvas.renderAll();
  }
}

function resetZoom() {
  if (fabricCanvas) {
    fabricCanvas.setZoom(1);
    fabricCanvas.renderAll();
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleZoomTools() {
  if (canvasTools) {
    canvasTools.style.display = canvasTools.style.display === 'none' ? 'flex' : 'none';
  }
}

// Advanced tools
function undoAction() {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop();
    redoStack.push(fabricCanvas.toJSON());
    fabricCanvas.loadFromJSON(lastState);
    showMessage('Undone! ↩️');
  }
}

function redoAction() {
  if (redoStack.length > 0) {
    const lastState = redoStack.pop();
    undoStack.push(fabricCanvas.toJSON());
    fabricCanvas.loadFromJSON(lastState);
    showMessage('Redone! ↪️');
  }
}

function cropImage() {
  showMessage('Crop feature coming soon! ✂️');
}

function rotateImage() {
  if (!fabricCanvas) return;
  
  const activeObject = fabricCanvas.getActiveObject();
  if (activeObject) {
    activeObject.rotate((activeObject.angle || 0) + 90);
    fabricCanvas.renderAll();
    showMessage('Image rotated! 🔄');
  }
}

function flipImage() {
  if (!fabricCanvas) return;
  
  const activeObject = fabricCanvas.getActiveObject();
  if (activeObject) {
    activeObject.set('flipX', !activeObject.flipX);
    fabricCanvas.renderAll();
    showMessage('Image flipped! 🔄');
  }
}

// Template functions
function applyTemplate(template) {
  showMessage(`Template "${template}" applied! 📋`);
}

// Save and load functions
function saveDesign() {
  if (!fabricCanvas) return;
  
  const design = {
    canvas: fabricCanvas.toJSON(),
    timestamp: Date.now(),
    statistics: statistics
  };
  
  localStorage.setItem('creativeStudioDesign', JSON.stringify(design));
  updateStatistics('saves');
  showMessage('Design saved! 💾');
}

function loadLocalDesign() {
  const saved = localStorage.getItem('creativeStudioDesign');
  if (saved && fabricCanvas) {
    try {
      const design = JSON.parse(saved);
      fabricCanvas.loadFromJSON(design.canvas);
      statistics = design.statistics || statistics;
      updateStatisticsDisplay();
      showMessage('Design loaded! 📂');
    } catch (error) {
      console.error('Error loading design:', error);
    }
  }
}

function clearCanvas() {
  if (fabricCanvas) {
    fabricCanvas.clear();
    showMessage('Canvas cleared! 🗑️');
  }
}

function shareToWall() {
  showMessage('Share feature coming soon! 📤');
}

// Statistics functions
function updateStatistics(type) {
  switch (type) {
    case 'photos':
      statistics.photos++;
      break;
    case 'stickers':
      statistics.stickers++;
      break;
    case 'saves':
      statistics.saves++;
      break;
  }
  
  updateStatisticsDisplay();
}

function updateStatisticsDisplay() {
  if (photoCount) photoCount.textContent = statistics.photos;
  if (stickerCount) stickerCount.textContent = statistics.stickers;
  if (saveCount) saveCount.textContent = statistics.saves;
  
  if (totalPhotos) totalPhotos.textContent = statistics.photos;
  if (totalStickers) totalStickers.textContent = statistics.stickers;
  if (totalSaves) totalSaves.textContent = statistics.saves;
}

function loadStatistics() {
  const saved = localStorage.getItem('creativeStudioStats');
  if (saved) {
    try {
      statistics = JSON.parse(saved);
      updateStatisticsDisplay();
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }
}

function startSessionTimer() {
  setInterval(() => {
    const minutes = Math.floor((Date.now() - sessionStartTime) / 60000);
    if (sessionTime) sessionTime.textContent = minutes;
  }, 60000);
}

function updateCanvasInfo(info) {
  if (canvasInfo) canvasInfo.textContent = info;
}

// Utility functions
function showMessage(message) {
  const popup = document.createElement('div');
  popup.className = 'message-popup';
  popup.textContent = message;
  document.body.appendChild(popup);
  
  setTimeout(() => {
    popup.remove();
  }, 3000);
}

function playSound(soundName) {
  const audio = document.getElementById(soundName);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
}

function handleKeyboardShortcuts(e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 's':
        e.preventDefault();
        saveDesign();
        break;
      case 'z':
        e.preventDefault();
        undoAction();
        break;
      case 'y':
        e.preventDefault();
        redoAction();
        break;
    }
  }
}

// Debug functions
window.testStickerWall = {
  checkElements: () => {
    console.log('🔍 Checking elements...');
    console.log('Canvas:', canvas);
    console.log('Photo input:', photoInput);
    console.log('Fabric canvas:', fabricCanvas);
    console.log('Current photo:', currentPhoto ? 'Loaded' : 'None');
    console.log('Active tool:', activeTool);
    console.log('Selected color:', selectedColor);
    console.log('Current frame:', currentFrame);
  },
  
  testPhotoUpload: () => {
    console.log('📸 Testing photo upload...');
    if (photoInput) {
      photoInput.click();
    } else {
      console.error('Photo input not found');
    }
  },
  
  simulateFileUpload: (fileData) => {
    console.log('📁 Simulating file upload...');
    const event = new Event('change');
    event.target = { files: [fileData] };
    handlePhotoUpload(event);
  },
  
  getStatistics: () => {
    console.log('📊 Current statistics:', statistics);
    return statistics;
  },
  
  clearAll: () => {
    console.log('🗑️ Clearing everything...');
    localStorage.clear();
    if (fabricCanvas) fabricCanvas.clear();
    statistics = { photos: 0, stickers: 0, saves: 0, sessionMinutes: 0 };
    updateStatisticsDisplay();
    showMessage('Everything cleared! 🗑️');
  },
  
  testCanvas: () => {
    console.log('🎨 Testing canvas functionality...');
    if (!fabricCanvas) {
      console.error('Fabric canvas not initialized');
      return;
    }
    
    // Test adding a simple shape
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#ff6b9d',
      selectable: true,
      draggable: true
    });
    
    fabricCanvas.add(rect);
    fabricCanvas.renderAll();
    console.log('✅ Test rectangle added to canvas');
  },
  
  testStickers: () => {
    console.log('🎯 Testing sticker functionality...');
    if (!fabricCanvas) {
      console.error('Fabric canvas not initialized');
      return;
    }
    
    // Add test stickers
    const testStickers = ['💖', '🌸', '⭐', '🎁'];
    testStickers.forEach((sticker, index) => {
      const text = new fabric.Text(sticker, {
        left: 50 + (index * 60),
        top: 200,
        fontSize: 40,
        fill: selectedColor,
        selectable: true,
        draggable: true
      });
      fabricCanvas.add(text);
    });
    
    fabricCanvas.renderAll();
    console.log('✅ Test stickers added to canvas');
  },
  
  testText: () => {
    console.log('📝 Testing text functionality...');
    if (!fabricCanvas) {
      console.error('Fabric canvas not initialized');
      return;
    }
    
    const text = new fabric.Text('Test Text', {
      left: 150,
      top: 300,
      fontSize: 30,
      fill: selectedColor,
      selectable: true,
      draggable: true
    });
    
    fabricCanvas.add(text);
    fabricCanvas.renderAll();
    console.log('✅ Test text added to canvas');
  },
  
  testFrames: () => {
    console.log('🖼️ Testing frame functionality...');
    const frames = ['hearts', 'flowers', 'stars', 'vintage', 'polaroid', 'crystal', 'magic'];
    const randomFrame = frames[Math.floor(Math.random() * frames.length)];
    selectFrame(randomFrame);
    console.log(`✅ Applied ${randomFrame} frame`);
  },
  
  testDrawing: () => {
    console.log('🎨 Testing drawing functionality...');
    setupDrawing();
    console.log('✅ Drawing mode activated');
  },
  
  testExport: () => {
    console.log('📤 Testing export functionality...');
    if (!fabricCanvas) {
      console.error('Fabric canvas not initialized');
      return;
    }
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 0.8
    });
    
    console.log('✅ Export data URL generated:', dataURL.substring(0, 50) + '...');
    return dataURL;
  },
  
  getCanvasState: () => {
    if (!fabricCanvas) {
      console.error('Fabric canvas not initialized');
      return null;
    }
    
    const state = fabricCanvas.toJSON();
    console.log('📊 Canvas state:', state);
    return state;
  },
  
  loadCanvasState: (state) => {
    if (!fabricCanvas) {
      console.error('Fabric canvas not initialized');
      return;
    }
    
    try {
      fabricCanvas.loadFromJSON(state);
      console.log('✅ Canvas state loaded');
    } catch (error) {
      console.error('❌ Error loading canvas state:', error);
    }
  },
  
  testAll: () => {
    console.log('🧪 Running all tests...');
    this.checkElements();
    this.testCanvas();
    this.testStickers();
    this.testText();
    this.testFrames();
    this.testDrawing();
    this.testExport();
    console.log('✅ All tests completed!');
  },
  
  // Additional utility functions
  resetCanvas: () => {
    console.log('🔄 Resetting canvas...');
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.renderAll();
      showMessage('Canvas reset! 🔄');
    }
  },
  
  saveTestDesign: () => {
    console.log('💾 Saving test design...');
    saveDesign();
    console.log('✅ Test design saved');
  },
  
  loadTestDesign: () => {
    console.log('📂 Loading test design...');
    loadLocalDesign();
    console.log('✅ Test design loaded');
  },
  
  testPerformance: () => {
    console.log('⚡ Testing performance...');
    const startTime = performance.now();
    
    // Add multiple objects to test performance
    for (let i = 0; i < 10; i++) {
      const rect = new fabric.Rect({
        left: Math.random() * 400,
        top: Math.random() * 300,
        width: 50,
        height: 50,
        fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
        selectable: true,
        draggable: true
      });
      fabricCanvas.add(rect);
    }
    
    fabricCanvas.renderAll();
    const endTime = performance.now();
    console.log(`✅ Performance test completed in ${(endTime - startTime).toFixed(2)}ms`);
  },
  
  getHelp: () => {
    console.log(`
🎨 Creative Studio Debug Commands:
================================
• testStickerWall.checkElements() - Check all DOM elements
• testStickerWall.testPhotoUpload() - Test photo upload
• testStickerWall.testCanvas() - Test canvas functionality
• testStickerWall.testStickers() - Test sticker system
• testStickerWall.testText() - Test text functionality
• testStickerWall.testFrames() - Test frame system
• testStickerWall.testDrawing() - Test drawing mode
• testStickerWall.testExport() - Test export functionality
• testStickerWall.testAll() - Run all tests
• testStickerWall.resetCanvas() - Reset canvas
• testStickerWall.saveTestDesign() - Save current design
• testStickerWall.loadTestDesign() - Load saved design
• testStickerWall.testPerformance() - Performance test
• testStickerWall.getCanvasState() - Get canvas state
• testStickerWall.loadCanvasState(state) - Load canvas state
• testStickerWall.clearAll() - Clear everything
• testStickerWall.getStatistics() - Get current statistics
• testStickerWall.getHelp() - Show this help
    `);
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);