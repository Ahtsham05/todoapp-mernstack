import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const cookieExtracter = req => {
  const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
  return accessToken
}

const options = {
  jwtFromRequest: cookieExtracter,
  secretOrKey: process.env.JWTSECRET,
};

export default function configureJwtStrategy(passport) {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id).select("-password -otp -otp_expiry");
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
}
