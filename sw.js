const CACHE_NAME = 'for-my-baby-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/assets/audio/bg-music.mp3',
  '/assets/audio/click.wav',
  '/assets/audio/hug.wav',
  '/assets/audio/match.wav',
  '/assets/audio/noti sound.mp3',
  '/assets/audio/pop.mp3',
  '/assets/audio/win.mp3',
  '/assets/audio/chilllofi.mp3',
  '/assets/audio/unlock.mp3',
  '/features/shared/global-settings.js',
  '/features/shared/settings.css',
  '/features/message/supabase-config.js',
  '/features/message/global-message.js',
  '/features/hug/hug.html',
  '/features/hug/hug.css',
  '/features/hug/hug.js',
  '/features/memory-match/memory.html',
  '/features/memory-match/memory.css',
  '/features/memory-match/memory.js',
  '/features/message/message.html',
  '/features/message/message.css',
  '/features/message/message.js',
  '/features/quiz/quiz.html',
  '/features/quiz/quiz.css',
  '/features/quiz/quiz.js',
  '/features/fortune/fortune.html',
  '/features/fortune/fortune.css',
  '/features/fortune/fortune.js',
  '/features/challenge/challenge.html',
  '/features/challenge/challenge.css',
  '/features/challenge/challenge.js',
  '/features/dress-bunny/dress.html',
  '/features/dress-bunny/dress.css',
  '/features/dress-bunny/dress.js',
  '/features/story/story.html',
  '/features/story/story.css',
  '/features/story/story.js',
  '/features/scoreboard/scoreboard.html',
  '/features/scoreboard/scoreboard.css',
  '/features/scoreboard/scoreboard.js',
  '/features/sticker-wall/sticker.html',
  '/features/sticker-wall/sticker.css',
  '/features/sticker-wall/sticker.js',
  '/features/unlock-note/unlock.html',
  '/features/unlock-note/unlock.css',
  '/features/unlock-note/unlock.js',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Don't cache non-GET requests or non-successful responses
            if (event.request.method !== 'GET' || !fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response
            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync tasks
  console.log('Background sync triggered');
  return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'You have a new love message! 💕',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/assets/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('For My Baby 💕', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 