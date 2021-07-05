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

// user list
let userList = [
  { username: 'yvette', password: 'yvette', account: 1000 },
  { username: 'star', password: 'star', account: 100000 },
];

let SESSION_ID = 'connect.sid';
let session = {};

// login
app.post('/api/login', (req, res) => {
  let { username, password } = req.body;
  let user = userList.find(
    (item) => item.username === username && item.password === password
  );
  if (user) {
    // user login, cookie
    const cardId = Math.random() + Date.now();
    session[cardId] = { user };
    res.cookie(SESSION_ID, cardId);
    res.json({ code: 0 }); // send JSON response
  } else {
    res.json({
      code: 1,
      error: `${username} does not exist or password mismatch`,
    });
  }
});

app.get('/api/userinfo', (req, res) => {
  let info = session[req.cookies[SESSION_ID]];

  /** add verification code */
  // data:svg, text: verification code
  let { data, text } = svgCaptcha.create();
  if (info) {
    // logged in
    let username = info.user.username;
    info.code = text; //  next request,compare verification code
    res.json({
      code: 0,
      info: { username, account: info.user.account, svg: data },
    });
  } else {
    res.json({ code: 1, error: 'user not logged in.' });
  }
});

app.post('/api/transfer', (req, res) => {
  let info = session[req.cookies[SESSION_ID]];
  if (info) {
    // user logged in
    let { payee, amount } = req.body;
    let username = info.user.username;
    userList.forEach((user) => {
      if (user.username === username) {
        user.account -= amount;
      }
      if (user.username === payee) {
        user.account += amount;
      }
    });

    res.json({ code: 0 });
  } else {
    res.json({ code: 1, error: 'user not logged in .' });
  }
});

// verification --> transfer
app.post('/api/transfer1', (req, res) => {
  let info = session[req.cookies[SESSION_ID]];

  if (info) {
    // logged in
    let { payee, amount, code } = req.body;
    if (
      code &&
      code.toUpperCase() === info.code.toUpperCase() &&
      Number(amount)
    ) {
      // verification code
      let username = info.user.username;
      userList.forEach((user) => {
        if (user.username === username) {
          user.account -= amount;
        }
        if (user.username === payee) {
          user.account += amount;
        }
      });
      res.json({ code: 0 });
    } else {
      res.json({ code: 1, error: 'code error.' });
    }
  } else {
    res.json({ code: 1, error: 'user not logged in' });
  }
});

// referer: where does the request
app.post('/api/transfer2', (req, res) => {
  let info = session[req.cookies[SESSION_ID]];
  if (info) {
    // logged in
    let { payee, amount } = req.body;
    let referer = req.headers['referer'] || '';
    if (Number(amount) && referer.includes('localhost:3001')) {
      // referer ok ,same origin
      let username = info.user.username;
      userList.forEach((user) => {
        if (user.username === username) user.account -= amount;
        if (user.username === payee) {
          use.amount += amount;
        }
      });
      res.json({ code: 0 });
    }
  } else {
    res.json({ code: 1, error: 'user not logged in.' });
  }
});

// Token before transfer
app.post('/api/transfer3', (req, res) => {
  let info = session[req.cookies[SESSION_ID]];
  if (info) {
    // logged in
    let { payee, amount, token } = req.body;
    console.log(token, 'mytoken_' + req.cookies[SESSION_ID]);
    let referer = req.headers['referer'] || '';
    if (Number(amount) && referer.includes('localhost:3001')) {
      // referer ok ,same origin
      let username = info.user.username;
      userList.forEach((user) => {
        if (user.username === username) user.account -= amount;
        if (user.username === payee) {
          user.amount += amount;
        }
      });
      res.json({ code: 0 });
    } else {
      res.json({ code: 1, error: 'illegal.' });
    }
  } else {
    res.json({ code: 1, error: 'user not logged in.' });
  }
});

app.listen(3001);
