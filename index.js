const express = require("express")

const port = 3000

const url = "mongodb://localhost:27017/rsvp"

const app = express()
app.use(express.urlencoded())
app.set("view engine", "pug")

const mongoose = require('mongoose');
mongoose.connect(url);

const Schema = mongoose.Schema
const responseSchema = new Schema ({
    name: String,
    email: String,
    attending: String,
    guestnumber: Number
})

const Response = mongoose.model('Response', responseSchema)

const rsvp = mongoose.connection;

rsvp.on('error', console.error.bind(console, 'connection error'))
rsvp.once('open', function() {
    console.log('we live')
})

app.listen(port)

app.get('/', function(req, res) {
    res.render('get')
})

app.post('/rsvp', function(req, res) {
    const userResponse = new Response({
        name: req.body.name,
        email: req.body.email,
        attending: req.body.attending,
        guestnumber: req.body.guestnumber
    })
    userResponse.save(function (err, userResponse) {
        if (err) return console.error(err)
        res.render('post')
    })
})

app.get('/guestlist', function(req, res) {
    Response.find(function(err, userResponse) {
        if (err) return console.error(err)
        console.log(userResponse)
        res.render('guestlist', ({userResponse}))
    })
})