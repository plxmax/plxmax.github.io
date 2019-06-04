const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try{
    const token  = req.headers.authorization.split(" ")[1]; // Because the header is something like this:
    // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9vb0Bvb28uY29tIiwidXNlcklkIjoiNWNkZTU0NmQ0YjgxOTIzMzY4OTQzNjZiIiwiaWF0IjoxNTU4NTE1NTI3LCJleHAiOjE1NTg1MTkxMjd9.HXxNlE0D3YkNfVui3TW5KIpZOISdKWNWEr0mCjXUN8U"
    // The second part is the token, so to extract it from the whole header we split it and use the second array element
    const decodedToken = jwt.verify(token, "RSGJud4@%hs!ej2dksfhjsh37dfishdf");
    // Here we used the secret string to verify if the token is valid.
    // It returns the decoded retieved token. So we can use it to extract the user Id which
    // has been sent via this token, for authorization purposes.
    req.userData = { email: decodedToken.email, userId: decodedToken.userId};
    // Here we add the required userData to the incomming request and pass it to the next middleware. It
    // is something similar to the interceptors in Angular
    next();
    } catch (error){
        res.status(401).json({
            message: "Authentication Failed (JWT couldn`t be extracted from the header or the token was not valid"
        });
    }
}