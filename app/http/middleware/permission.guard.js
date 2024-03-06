const createHttpError = require("http-errors");
const { PermissionModel } = require("../../model/RBAC/permission.model");
const { RoleModel } = require("../../model/RBAC/role.model");

function checkPermission(requiredPermission = []) {
  return async function (req, res, next) {
    try {
      const allPermissions = requiredPermission.flat(2);
      const user = req.user;
      const role = await RoleModel.findOne({ title: user.Role });
      const permission = await PermissionModel.find({
        _id: { $in: role.permission },
      });
      const userPermission = permission.map((item) => item.name);
      const hashPermission = requiredPermission.every((permission) => {
        return userPermission.includes(permission);
      });
      if (requiredPermission.length == 0 || hashPermission) return next();
      throw createHttpError.Forbidden("شما به این بخش دسترسی ندارید");
    } catch (error) {
      next(error);
    }
  };
}
