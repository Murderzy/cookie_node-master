import cookieSession from "cookie-session";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import route from "./routes/routes.js";
import ejsMate from "ejs-mate";
import express_validator from 'express-validator';




const app = express();
const PORT = 3000;
const KEY ='db4ae3ad53f49b30b40cc40551a1866fc13dc57befc7d311cd0fad5fb74160c90d14663eb5fd9855c40314ee704eb3221871975df705f7946fab0472dc7b3af4';
const __dirname = path.resolve();

app.use(cookieSession({
    name:'session',
    keys:['key1', 'key2'],
    maxAge:24*60*60*1000 //  24 hours
}));
app.engine("ejs",ejsMate);
app.set("views",path.resolve("./","views"));
app.set("view engine", "ejs");
app.set('trust proxy', 1)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.resolve("./","public")));
app.use(route);

app.listen(PORT);