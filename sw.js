// Service Worker for Baby Love App
const CACHE_NAME = 'baby-love-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
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
  '/assets/audio/bg-music.mp3',
  '/assets/audio/game.mp3',
  '/assets/audio/game1.mp3',
  '/assets/audio/click.mp3',
  '/assets/audio/noti.mp3',
  '/CHANGELOG.md'
];

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
          .catch(() => {
            // If network fails, try to serve a fallback
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
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
});

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