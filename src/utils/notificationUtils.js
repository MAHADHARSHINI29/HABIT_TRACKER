// src/utils/notificationUtils.js
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
};

export const showReminderNotification = (habitName) => {
  if (Notification.permission === "granted") {
    new Notification("⏰ Habit Reminder", {
      body: `Don’t forget: ${habitName}`,
      icon: "/icon-192x192.png", // optional PWA icon
    });
  }
};
