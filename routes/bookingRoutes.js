const express = require("express")
const bookingRouter = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")
const { createBooking, getBookings, updateBooking, deleteBooking, approveBooking, rejectBooking } = require("../controllers/bookingController")

bookingRouter.use(authMiddleware)

bookingRouter.post("/",createBooking)
bookingRouter.get("/",getBookings)
bookingRouter.put("/:id",updateBooking)
bookingRouter.delete("/:id",deleteBooking)
bookingRouter.patch("/:id/approve",roleMiddleware("admin"),approveBooking)
bookingRouter.patch("/:id/reject",roleMiddleware("admin"),rejectBooking)


module.exports = bookingRouter