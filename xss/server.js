/**
 * cookie
 */

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

// set path
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, 'images')));
// turn parameters into object
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); // Parse URL-encoded bodies
app.use(cookieParser());

// user list
let userList = [
  { username: 'yvette', password: 'yvette' },
  { username: 'star', password: 'star' },
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

// 1, Reflected XSS
// http://localhost:3000/error?type=<script>alert('malicious code')</script>
app.get('/error', function (req, res) {
  res.send(`${req.query.type}`);
});

app.get('/welcome', function (req, res) {
  // encode URI, prevent attacks
  res.send(`${encodeURIComponent(req.query.type)}`);
});

// list of comments
let comments = [
  { username: 'yve', content: 'hello' },
  { username: 'yve', content: 'world' },
  { username: 'star', content: 'shining star' },
];
app.get('/getComments', function (req, res) {
  res.json({ code: 0, comments });
});

app.post('/addComment', function (req, res) {
  // cardId (req.cookies[SESSION_ID])
  let info = session[req.cookies[SESSION_ID]];
  if (info) {
    // log in
    let username = info.user.username;
    comments.push({ username, content: req.body.comment });
    res.json({ code: 0, comments });
  } else {
    res.json({ code: 1, error: 'user not logged in' });
  }
});

// safe comment
let comments2 = [
  { username: 'yve1', content: 'hello' },
  { username: 'yve1', content: 'world' },
  { username: 'star1', content: 'shining star' },
];

app.get('/getComment', function (req, res) {
  res.json({ code: 0, comments: comments2 });
});

function encodeHtml(str) {
  return str
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.post('/addComment2', function (req, res) {
  // cardId req.cookies[SESSION_ID]
  let info = session[req.cookies[SESSION_ID]];
  if (info) {
    // log in
    let username = info.user.username;
    comments.push({ username, content: encodeHtml(req.body.comment) });
    res.json({ code: 0, comments: comments2 });
  } else {
    res.json({ code: 1, error: 'user not logged in.' });
  }
});

app.listen(3000);
