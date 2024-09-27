function sendNotification(sender, message) {
  Notification.requestPermission().then((perm) => {
    if (perm !== "granted") {
      alert("Please allow notification to get Hot Notifications");
      return;
    }
    new Notification(`${sender} : ${message} `, {
      // body: `${"paste new mesage"}`,
      icon: "https://cdn.iconscout.com/icon/premium/png-512-thumb/chat-33390.png",
      vibrate: true,
    });
  });
}

export default sendNotification;
