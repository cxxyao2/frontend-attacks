# front-end attacks and prevetions

As front-end developers, we always try to minimize the risks of compromising the security of our front-end applications. Doing is the best kind of thinking. Know the most common front-end attacks and then prevent them.

---

## XSS

> cross-site scripting

1. Reflected XSS

   *  where the malicious script comes from the current HTTP request.
    *  Test steps: under xss folder,
    *  $node server.js
    *  in browser, enter localhost:3000/login.html
    *  enter wrong user/password(123/123), javascript in url is executed. http://localhost:3000/error?type=<script>alert('...')<script/>
    *  enter correct user/password(star/star), javascript in url is escaped.

2. Stored XSS

    *  where the malicious script comes from the website's database.
    *  in browser, enter localhost:3000/comments.html
    *  in comment field, enter 2222<script>alert(1)</script>. This comment is executed before save.
    *  in browser, enter localhost:3000/comments2.html
    *  in comment field, enter 2222<script>alert(1)</script>. This comment is escaped before save.

3. DOM-based XSS
    *  where the vulnerability exists in client-side code rather than server-side code.
    *  in browser, enter localhost:3000/after.html
    *  in comment field, enter 2222<script>alert(1)</script>. This comment is executed before save.

## CSRF

 *  Cross-site request forgery.
 *  Test steps:
 *  under csrf folder
 *  $node server.js
 *  $node server2.js
 *  in the same browser, enter http://localhost:3001, check the balance of user "star"
 *  in the same browser, enter http://localhost:3002/fish.html, steal the money of user "star"
 *  The difference between safe1.html,safe2.html,safe3.html;fish1.html/fish2.html/fish3.html is calling different API.

## Wrap up

Web security is a task that freont-end devleopers, backend developers and DevOps engineers have to deal with together.
