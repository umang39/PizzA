const { populate } = require('../../../app/models/order')
const Order = require('../../../app/models/order')
function orderController(){
    return {
        index(req,res){
            Order.find({staus : {$ne : 'completed'}},null,{sort : {'createdAt':-1}}).populate('customerId','-1password').exec((err,result)=>{
                if(req.xhr){
                    console.log(result)
                    return res.send(result)
                }
                    return res.render('admin/order')
            })
        }
    }
}
module.exports = orderController