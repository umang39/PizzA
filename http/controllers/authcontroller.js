const passport = require('passport')

module.exports = function(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    return{
        login(req,res){
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            
            const { email, password }   = req.body
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if(err) {
                   console.log('error')
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                   console.log('error1')

                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                   console.log('error2')

                        req.flash('error', info.message ) 
                        return next(err)
                    }
                    
                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        postLogout(req, res, next){
            req.logout()
            return res.redirect('/')
        },
        register(req,res){
            res.render('auth/register')
        },
        async postRegister(req,res){
                const {name,email,password} = req.body
                const User = require('../../app/models/user')
                if(!name || !email || !password){
                    req.flash('error','All fields are required')
                    
                    return res.redirect('/register')
                }
                //email exist ??
                User.exists({email: email},(err,result)=>{
                    if(result){
                        req.flash('error','email already taken')
                        return res.redirect('/register')
                    }
                })

                //haashing a password
                const bcrypt = require('bcrypt')
                const hashPassword = await bcrypt.hash(password,10)
                //create a user 
                let user = new User({
                    name ,
                    email ,
                    password : hashPassword
                })
                user.save().then((user) => {
                    //login
                    return res.redirect('/')
                }).catch((err) => {
                        req.flash('error', 'Something wenr wrong')
                        return res.redirect('/register')
                })
        }
    }
}