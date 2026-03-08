
const app = require('express').Router();


module.exports = (function () {

    var authRoutes = require("./v1/auth.routes");
    app.use('/auth', authRoutes); 
       
    var userRoutes = require("./v1/user.routes");
    app.use('/user', userRoutes);    

  
    return app;
})();

