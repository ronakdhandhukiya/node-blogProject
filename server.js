const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const bookingRouter = require("./routes/bookingRoutes")
const connectDb = require("./config/db")
const authRouter = require("./routes/authRoutes")
const app =express()
app.use(express.json())

const PORT = process.env.PORT

app.use("/",authRouter)
app.use("/bookings",bookingRouter)

app.listen(PORT,()=>{
  connectDb()
  console.log(`Server Running at ${PORT}`);
})