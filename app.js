const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors({
    origin: "http://blockchaingame.site/",
    credentials : true
}));

app.use(express.static(__dirname));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/main', express.static(path.join(__dirname, 'main')));

app.listen(7777, () => {
    console.log('7777 Server Open');
});