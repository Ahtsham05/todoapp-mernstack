import dotenv from 'dotenv';
import { app } from './app.js';
import dbConnection from './db/index.js';
import errorHandler from './utils/errorHandler.js';

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 7000;

app.use(errorHandler)

dbConnection().then(()=>{
    app.on("Error", (error) => {
        console.log("App Running Error!", error);
    });
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
})
.catch((error)=>{
    console.log("Database Connect Failed", error);
});