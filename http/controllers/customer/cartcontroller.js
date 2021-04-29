let menus = require('../../../app/models/menu')
function cartcontroller(){
        return {
            cart(req,res){
                // console.log(req.session.cart.items)
                // if(req.session.cart == undefined){
                  
                // }
                let sum = 0 
                if(req.session.cart){
                    for(let key  in req.session.cart.items){
                           console.log(req.session.cart.items[key])
                           let p = parseInt(req.session.cart.items[key].item.price)
                           let q = parseInt(req.session.cart.items[key].qty)
                           sum = sum + p * q
                    }
                }
                
               return res.render('customer/cart',{sum})
                // res.redirect('/')
            }, 
            updatecart(req,res){
                console.log(req.body)
                menus.findOne({_id : req.body.pizza}).then((data)=>{
            // creating cart first and adding basic structure
                    if(!req.session.cart){
                        req.session.cart = {
                            items : {},
                            totalQty : 0,
                            totalPrice : 0
                        }
                    }
                    let cart = req.session.cart

                    ///check items doesnot exist in cart
                   if(!cart.items[data._id]){
                            cart.items[data._id] = {item : data,   qty : 1}
                            cart.totalQty = cart.totalQty + 1
                            cart.totalPrice = cart.totalPrice  + data.price 

                   }
                   else{
                       cart.items[data._id].qty = cart.items[data._id].qty + 1
                       cart.totalQty = cart.totalQty + 1
                       cart.totalPrice = cart.totalPrice + data.price

                   }
                   return res.json({totalQty: req.session.cart.totalQty})
                })
               
            }
        }
}
module.exports = cartcontroller