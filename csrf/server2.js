/**
 * cookie
 */

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const svgCaptcha = require('svg-captcha');

// set path
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, '../')));
// turn parameters into object
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies
app.use(cookieParser());

app.listen(3002);
