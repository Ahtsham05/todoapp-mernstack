import passport from "passport"
import { roles } from "../config/roles.js";

export const auth = (action, resource) => {
  return (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({  message: "Unauthorized", status: 401 });
      }

      req.user = user;

      // Authorization logic
      const userRole = user.role;
      const permissions = roles[userRole] || [];

      // console.log("permissions",permissions)

      const hasPermission = permissions.some(
        (perm) =>
          (perm.resource === resource || perm.resource === "all") &&
          (perm.action === action || perm.action === "manage")
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden Access!", status: 403, data: { todos: [], users: [] } });
      }

      next();
    })(req, res, next);
  };
}