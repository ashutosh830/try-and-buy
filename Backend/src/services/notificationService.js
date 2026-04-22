async function sendNotification({ channel, to, subject, message }) {
  const payload = {
    channel,
    to,
    subject,
    message,
    sentAt: new Date().toISOString()
  };

  console.log("Notification stub", payload);
  return payload;
}

module.exports = {
  sendNotification
};
