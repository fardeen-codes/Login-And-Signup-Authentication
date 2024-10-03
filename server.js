const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

require('dotenv').config()

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())

require("./config/database").connect();

//route import and mount
const user = require('./routes/user.route');
app.use('/api/v1', user);

//activate
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})

app.get('/', (req, res) => {
    res.send('Welcome to Node.js API with JWT Authentication!');
})