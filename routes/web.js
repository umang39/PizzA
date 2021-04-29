let homecontroller = require('../http/controllers/homecontroller')
let authcontroller = require('../http/controllers/authcontroller')
let cartcontroller = require('../http/controllers/customer/cartcontroller')
let ordercontroller = require('../http/controllers/customer/ordercontroller')
let AdminOrderController = require('../http/controllers/admin/orderController')
let statusController = require('../http/controllers/admin/statusController')

const guest = require('../http/middlewares/guest')
const auth = require('../http/middlewares/auth')
const admin = require('../http/middlewares/admin')

function initRoutes(app) {
    app.get('/', homecontroller().index)
    app.get('/cart',cartcontroller().cart)
    app.get('/login',guest,authcontroller().login)
    app.post('/login',authcontroller().postLogin)
    app.get('/register',guest,authcontroller().register)
    app.post('/updatecart',cartcontroller().updatecart)
    app.post('/register',authcontroller().postRegister)
    app.post('/logout',authcontroller().postLogout)
    //customer routes
    app.post('/orders',auth,ordercontroller().store)
    app.get('/customer/orders',auth,ordercontroller().index)
    app.get('/customer/orders/:id',auth,ordercontroller().show)
//admin routes
    app.get('/admin/orders',admin,AdminOrderController().index)
    app.post('/admin/order/status',admin,statusController().update)
    app.post('/getData',homecontroller().getData)

}
module.exports = initRoutes