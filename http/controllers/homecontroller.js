const Menu = require('../../app/models/menu');
const Order = require('../../app/models/order');
function homecontroller(){
                 
                return {
                    index(req,res){
                        Menu.find({}).then((pizza)=>{
                          
                              
                                return  res.render('index.hbs',{pizza})
                        })
                       
                    },
                    getData(req, res) {
                        
                        Order.findOne({_id : req.body.id},(err,data)=>{
                            return res.send(data)
                        })

                        
                            
                        
                    }
                }
}
module.exports = homecontroller