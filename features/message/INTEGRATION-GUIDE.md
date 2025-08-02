# 🌐 Global Messaging System Integration Guide

This guide shows you how to add the messaging system to any page in your website.

## 🚀 Quick Integration

### Step 1: Add Supabase Scripts
Add these scripts to the `<head>` section of your HTML file:

```html
<!-- Supabase Client -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script src="features/message/supabase-config.js"></script>
```

### Step 2: Add Global Messaging Script
Add this script before the closing `</body>` tag:

```html
<!-- Global Messaging System -->
<script src="features/message/global-message.js"></script>
```

## 📱 What You Get

### Floating Message Button
- **Location**: Bottom-right corner of every page
- **Function**: Quick access to send messages
- **Animation**: Floating effect with hover tooltip
- **Click**: Navigates to message page

### Message Notifications
- **Trigger**: New messages arrive
- **Location**: Top-right corner
- **Duration**: Auto-hides after 8 seconds
- **Click**: Navigates to message page
- **Close**: × button to dismiss

### Real-time Checking
- **Frequency**: Checks every 30 seconds
- **Cross-device**: Syncs across all devices
- **Smart**: Only shows for new messages

## 🎨 Customization

### Hide Floating Button
Add this CSS to hide the floating button on specific pages:

```css
.global-message-btn {
  display: none !important;
}
```

### Custom Notification Position
Override the notification position:

```css
.global-message-notification {
  top: 50px !important;
  right: 50px !important;
}
```

## 📋 Example Integration

Here's a complete example for a new page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Page</title>
  <link rel="stylesheet" href="your-styles.css" />
  
  <!-- Supabase Client -->
  <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
  <script src="features/message/supabase-config.js"></script>
</head>
<body>
  <!-- Your page content here -->
  
  <!-- Global Messaging System -->
  <script src="features/message/global-message.js"></script>
</body>
</html>
```

## 🔧 Advanced Features

### Manual Message Checking
You can manually check for new messages:

```javascript
// Check for new messages
async function checkMessages() {
  const lastVisit = localStorage.getItem('lastVisitTime') || '0';
  const newMessages = await MessageService.getNewMessages(lastVisit);
  
  if (newMessages.length > 0) {
    // Handle new messages
    console.log(`You have ${newMessages.length} new messages!`);
  }
}
```

### Custom Notification
Create custom notifications:

```javascript
// Show custom notification
function showCustomNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'global-message-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">💌</span>
      <span class="notification-text">${message}</span>
      <button class="notification-close">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}
```

## 🎯 Features Summary

✅ **Floating Message Button** - Always accessible  
✅ **Real-time Notifications** - Instant message alerts  
✅ **Cross-device Sync** - Works on all devices  
✅ **Smart Checking** - Only shows new messages  
✅ **Easy Integration** - Just 2 script tags  
✅ **Responsive Design** - Works on mobile  
✅ **Customizable** - Easy to style and modify  

## 🚨 Troubleshooting

### Messages Not Syncing
1. Check if Supabase is configured in `supabase-config.js`
2. Verify the database table exists
3. Check browser console for errors

### Notifications Not Showing
1. Ensure scripts are loaded in correct order
2. Check if page has proper CSS for notifications
3. Verify MessageService is available

### Floating Button Missing
1. Check if `global-message.js` is loaded
2. Verify no CSS is hiding the button
3. Check browser console for JavaScript errors

## 💡 Tips

- **Test on different devices** to ensure cross-device sync works
- **Check browser console** for any error messages
- **Verify Supabase setup** before testing messaging features
- **Use incognito mode** to test as a different user

---

**Need help?** Check the main `SETUP-SUPABASE.md` file for database setup instructions! 