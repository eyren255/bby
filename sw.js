// Service Worker for Baby Love App
const CACHE_NAME = 'baby-love-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/browserconfig.xml',
  '/password.js',
  '/firebase.js',
  '/firebase-upload.js',
  '/features/shared/settings.js',
  '/features/shared/settings.css',
  '/features/memory-match/memory.html',
  '/features/memory-match/memory.css',
  '/features/memory-match/memory.js',
  '/features/quiz/quiz.html',
  '/features/quiz/quiz.css',
  '/features/quiz/quiz.js',
  '/features/hug/hug.html',
  '/features/hug/hug.css',
  '/features/hug/hug.js',
  '/features/challenge/challenge.html',
  '/features/challenge/challenge.css',
  '/features/challenge/challenge.js',
  '/features/sticker-wall/sticker.html',
  '/features/sticker-wall/sticker.css',
  '/features/sticker-wall/sticker.js',
  '/features/message/message.html',
  '/features/message/message.css',
  '/features/message/message.js',
  '/features/unlock-note/unlock.html',
  '/features/unlock-note/unlock.css',
  '/features/unlock-note/unlock.js',
  '/features/scoreboard/scoreboard.html',
  '/features/scoreboard/scoreboard.css',
  '/features/scoreboard/scoreboard.js',
  '/features/dress-bunny/dress.html',
  '/features/dress-bunny/dress.css',
  '/features/dress-bunny/dress.js',
  '/features/story/story.html',
  '/features/story/story.css',
  '/features/story/story.js',
  '/features/fortune/fortune.html',
  '/features/fortune/fortune.css',
  '/features/fortune/fortune.js',
  // Audio files
  '/assets/audio/bg-music.mp3',
  '/assets/audio/game.mp3',
  '/assets/audio/game1.mp3',
  '/assets/audio/click.wav',
  '/assets/audio/noti sound.mp3',
  '/assets/audio/pop.mp3',
  '/assets/audio/chilllofi.mp3',
  '/assets/audio/win.mp3',
  '/assets/audio/match.wav',
  '/assets/audio/hug.wav',
  // Media files
  '/assets/gif/hug.gif',
  '/assets/video/hug.mp4',
  // Icons (if they exist)
  '/icons/icon-16x16.png',
  '/icons/icon-32x32.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
  '/CHANGELOG.md'
];

// Offline fallback page
const offlineFallback = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baby Love - Offline</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #ff69b4, #ff8fab);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .offline-container {
            text-align: center;
            max-width: 400px;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        .offline-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        h1 {
            margin-bottom: 1rem;
            font-size: 1.8rem;
        }
        p {
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>You're Offline 💕</h1>
        <p>Don't worry! Most of Baby Love works offline. Some features might need internet connection.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
    </div>
</body>
</html>
`;

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app resources...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
        // Continue installation even if some resources fail to cache
        return Promise.resolve();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }
        
        // Otherwise, fetch from network
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the new response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('📦 Cached new resource:', event.request.url);
              });
            
            return response;
          })
          .catch((error) => {
            console.log('❌ Network failed, serving offline fallback:', event.request.url);
            
            // If it's a document request, serve offline page
            if (event.request.destination === 'document') {
              return new Response(offlineFallback, {
                headers: { 'Content-Type': 'text/html' }
              });
            }
            
            // For other resources, try to serve from cache with different URL
            return caches.match(event.request.url.split('?')[0]);
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any background sync tasks
      console.log('🔄 Processing background sync...')
    );
  }
  
  if (event.tag === 'offline-actions-sync') {
    event.waitUntil(
      // Sync offline actions when connection is restored
      syncOfflineActionsFromServiceWorker()
    );
  }
});

// Sync offline actions from service worker
async function syncOfflineActionsFromServiceWorker() {
  try {
    // Get offline actions from IndexedDB or localStorage
    const offlineActions = await getOfflineActionsFromStorage();
    
    if (offlineActions && offlineActions.length > 0) {
      console.log('🔄 Service Worker syncing offline actions:', offlineActions.length);
      
      for (const action of offlineActions) {
        try {
          await processOfflineAction(action);
          // Remove successful action
          await removeOfflineAction(action.id);
        } catch (error) {
          console.error('❌ Failed to sync action:', action, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Get offline actions from storage
async function getOfflineActionsFromStorage() {
  // Try to get from localStorage first
  try {
    const stored = localStorage.getItem('babyLove_offlineActions');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('❌ Failed to get offline actions from localStorage:', error);
  }
  
  return [];
}

// Remove offline action from storage
async function removeOfflineAction(actionId) {
  try {
    const stored = localStorage.getItem('babyLove_offlineActions');
    if (stored) {
      const actions = JSON.parse(stored);
      const filteredActions = actions.filter(action => action.id !== actionId);
      localStorage.setItem('babyLove_offlineActions', JSON.stringify(filteredActions));
    }
  } catch (error) {
    console.error('❌ Failed to remove offline action:', error);
  }
}

// Process offline action (same as in main script)
async function processOfflineAction(action) {
  switch (action.type) {
    case 'message':
      return await syncOfflineMessage(action);
    case 'score':
      return await syncOfflineScore(action);
    case 'game_result':
      return await syncOfflineGameResult(action);
    case 'setting':
      return await syncOfflineSetting(action);
    default:
      console.warn('⚠️ Unknown action type:', action.type);
      return Promise.resolve();
  }
}

async function syncOfflineMessage(action) {
  console.log('💌 Service Worker syncing offline message:', action.data);
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve();
}

async function syncOfflineScore(action) {
  console.log('🏆 Service Worker syncing offline score:', action.data);
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve();
}

async function syncOfflineGameResult(action) {
  console.log('🎮 Service Worker syncing offline game result:', action.data);
  await new Promise(resolve => setTimeout(resolve, 400));
  return Promise.resolve();
}

async function syncOfflineSetting(action) {
  console.log('⚙️ Service Worker syncing offline setting:', action.data);
  await new Promise(resolve => setTimeout(resolve, 200));
  return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New message from Baby Love! 💕',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Baby Love 💕', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🔄 Service Worker script loaded'); 