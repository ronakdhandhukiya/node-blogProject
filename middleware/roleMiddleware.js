const roleMiddleware = (role)=>{
  return(req,res,next)=>{
    if(!req.user){
    return res.status(401).json({message: "Please login first"})
    }

    if(req.user.role !==role){
      return res.status(403).json({message: "You are not allowed to access this route"});
    }
    next()
  }
}

module.exports = roleMiddleware