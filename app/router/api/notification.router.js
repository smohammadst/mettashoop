const { NotificationController } = require('../../http/controller/api/notification.controller');
const { checkRole } = require('../../http/middleware/checkLogin');

const router = require('express').Router();

router.post("/add", NotificationController.addUserNotification);

router.get("/all", checkRole("ADMIN"), NotificationController.getAllNotification);

module.exports = {
    NotificationRouter: router
}