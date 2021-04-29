const Order = require('../../../app/models/order')
const moment = require('moment')
function ordercontroller(){
    return {
        async store(req,res){
            const {phone , address} = req.body
            if(!phone || !address){
            
                req.flash('error','All fields must be required')
               return res.redirect('/cart')
            }
            const order =await  new  Order({
                customerId : req.user._id,
                items : req.session.cart.items,
                phone : phone ,
                address : address
            })
            await order.save().then(result => {
                console.log(result)
                req.flash('success','order placed successfully')
                delete req.session.cart 
                //emit
                // const eventEmitter = req.app.get('eventEmitter')
                // eventEmitter.emit('orderPlaced',result)
                return res.redirect('/customer/orders')
            }).catch(err =>{
                console.log('h3')

                req.flash('error','something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            const orders = await Order.find({customerId : req.user._id},null,{sort : {'createdAt' : -1}})

            console.log(orders)
            res.header('Cache-Control', 'no-store')
            res.render('customer/orders',{orders: orders,moment})
        },
        async show(req,res) {
           const order = await Order.findById(req.params.id)
           //authorize user
           if(req.user._id.toString() == order.customerId.toString()){
               return res.render('customer/singleOrder',{order : order})
           }
           else{
               return res.redirect('/')
           }
        }
    }
}
module.exports =  ordercontroller