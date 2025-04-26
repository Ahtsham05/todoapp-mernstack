import * as userService from "../services/user.service.js"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

export default function configureGoogleStrategy(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {

          const emailExisted = await userService.findOneUser({email : profile?.emails?.[0]?.value})
          if(emailExisted && emailExisted.password){
            return done(null, null);
          }

          let user = await userService.findOneUser({ googleId: profile.id });
          if (!user) {
            user = await userService.createUser({
              googleId: profile.id,
              email: profile?.emails?.[0]?.value || null,
              verified: profile?.emails?.[0]?.verified || false,
            })
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}
