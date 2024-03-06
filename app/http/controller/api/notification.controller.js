const { StatusCodes } = require("http-status-codes");
const { ProductModel } = require("../../../model/products");
const { UserModel } = require("../../../model/user.model");
const { invoiceNumberGenerator } = require("../../../module/functions");
const moment = require("moment-jalali");

class Notification {
    async addUserNotification(req, res, next) {
        try {
            const user = req.user;
            const { id, color } = req.body
            const idproduct = await ProductModel.findOne({ _id: id });
            for (var i = 0; i < idproduct.list_notification.length; i++) {
                if (idproduct.list_notification[i].phone == user.phone) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        message: "شما قبلا اضافه شده ایید به لیست انتظار",
                        statusCodes: StatusCodes.BAD_REQUEST
                    })
                }
            }
            const product = await ProductModel.updateOne({ _id: id }, {
                $push: {
                    "list_notification": { phone: user.phone, date: "" + moment().format("jYYYYjMMjDDHHmmss"), color }
                }
            });
            return res.status(StatusCodes.OK).json({
                statusCodes: StatusCodes.OK
            })
        } catch (error) {
            next(error)
        }
    }
    async getAllNotification(req, res, next) {
        try {
            const allNotification = await ProductModel.find({ notification: true });
            let list = [];
            console.log(allNotification[0]);
            for (var i = 0; i < allNotification.length; i++) {
                const product = await ProductModel.findOne({ _id: allNotification[i]._id });
                let users = []
                for (let i = 0; i < product.list_notification.length; i++) {
                    const user = await UserModel.findOne({ phone: product.list_notification[i].phone });
                    users.push({
                        last_name: user.last_name,
                        first_name: user.first_name,
                        date: product.list_notification[i].date,
                        color: product.list_notification[i].color
                    })
                }
                list.push({
                    users,
                    title_product: product.title,
                    length_notification: product.list_notification.length
                })
            }
            return res.status(StatusCodes.OK).json({
                statusCodes: StatusCodes.OK,
                allNotification,
                list
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    NotificationController: new Notification()
}