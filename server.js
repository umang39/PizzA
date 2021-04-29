const express = require('express');
const  app = express();
const host = '0.0.0.0'
const port = process.env.PORT || 3333
const hbs = require('hbs')
const mongoose = require('mongoose')
const session = require('express-session')
require('dotenv').config()
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport')
const Emitter = require('events')
//////////////////////////////////////data base connection///////////////////////////////////////////////////////////////////////////////////////////////////////
// const url = 'mongodb://127.0.0.1:27017/pizza'

mongoose.connect(url,{useNewUrlParser : true,useUnifiedTopology: true })
mongoose.connection.once('open',() => {
    console.log('data base connection established')
}).catch(()=>{
    console.log('connection failed')
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//event emmiteer
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)
//session config
app.use(session({
    secret : process.env.COOKIE_SECRET ,
    resave : false,
    store : MongoDbStore.create({ mongoUrl: url }),
    saveUninitialized : false,
    cookie : {  maxAge : 10000 * 60 * 60 * 24} /// 24hrs
}))

app.use(flash())
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
////
app.use((req,res,next) => {
    res.locals.user = req.user
    res.locals.session = req.session
    next()
})
hbs.registerPartials('./views/partials')
app.set('view engine','hbs')
app.set('views',__dirname + '/views');
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use('/',express.static(__dirname + '/public'))
require('./routes/web')(app)
//passport config





const server = app.listen(port,host,()=>{
    console.log(`listening on port ${port}`);
});



/////socket.io
const io = require('socket.io')(server);
io.on('connection',(socket)=>{
    //join
    console.log(socket.id)
    socket.on('join',(orderId)=>{
        console.log('orderid '+ orderId)
        socket.join(orderId)
    })
})
eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})
eventEmitter.on('orderPlaced',()=>{
    io.to('adminRoom').emit('orderPlaced',data)
})