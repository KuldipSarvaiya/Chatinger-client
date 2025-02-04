function sendNotification(sender, message, body = '') {
  Notification.requestPermission().then((perm) => {
    new Notification(`${sender} : ${message} `, {
      body: body || "",
      icon: "https://cdn.iconscout.com/icon/premium/png-512-thumb/chat-33390.png",
      vibrate: true,
    });
  });
}

export default sendNotification;
