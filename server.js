var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

require('dotenv').config();

var Message = mongoose.model('Message', {
    name: String,
    message: String
});

var dbUrl = process.env.dbUrl

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = Promise

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) => {

    try{
        var message = new Message(req.body)
        var savedMessage = await message.save()
        console.log('saved')
        
        var censored = await Message.findOne({ message: 'badword'})
        if (censored) {
            await Message.remove({_id: censored.id})
        } else {
            io.emit('message', req.body)
        }
    
        res.sendStatus(200)    
    } catch(error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log("Finally is called")
    }
})


io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.set('strictQuery', false);
mongoose.connect(dbUrl, (err) => {
    console.log('mongo db connection', err);
})

var server = http.listen(3000, () => {
    console.log('Server is listening on port', server.address().port)
})