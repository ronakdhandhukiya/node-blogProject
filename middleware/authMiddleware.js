const jwt = require('jsonwebtoken')

const authMiddleware = async(req,res,next)=>{
  const authHeader = req.headers.authorization

  if(!authHeader){
    return res.status(401).json({message : "Access token is required"})
  }

  const accessToken = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

    req.user = decoded
    next()
  } catch (error) {
    return res.status(500).json({ message: "Access token is invalid or expired"})
  }
}

module.exports = authMiddleware;