import express from 'express';
import cors from 'cors';
import passport from "passport"
import cookieParser from "cookie-parser"
import configureJwtStrategy from './utils/passport-jwt.js';
import configureGoogleStrategy from './utils/google-jwt.js';

const app = express();

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}))

app.use(passport.initialize());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

configureJwtStrategy(passport)
configureGoogleStrategy(passport)

//Routes Here Added
import routes from './routes/index.js';

// deprecate this
app.use("/api/v1",routes)


export { app };