require('dotenv').config();
const express = require('express');
const WSserver = require('express-ws');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000
const wsInsteance = WSserver(app)
const aWss = wsInsteance.getWss()
const imageGet = require('./controllers/imageGet');
const imagePost = require('./controllers/imagePost');
const wsController = require('./handlers/wsController')

app.use(cors())
app.use(express.json())

app.ws('/', wsController(aWss))
app.get('/image', imageGet)
app.post('/image', imagePost)

app.listen(PORT, () => 
    {console.log(`server started on PORT ${PORT}`);
})