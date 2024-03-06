const { default: mongoose } = require("mongoose");

const Notification = new mongoose.Schema({
    product
});

const NotificationModel = mongoose.model("notification", Notification);

module.exports = { NotificationModel };
