const Booking = require('../models/booking.model')

const createBooking = async (req, res) => {
  try {
    const { serviceName, requestedDate } = req.body

    if (!serviceName || !requestedDate) {
      return res.status(400).json({ message: "Service name and requested date are required" })
    }

    const bookingDate = new Date(requestedDate)

    if (Number.isNaN(bookingDate.getTime()) || bookingDate <= new Date()) {
      return res.status(400).json({ message: "Please select a valid future date and time" });
    }

    const newBooking = new Booking({ ...req.body, requestedDate: bookingDate, status: "pending" })

    await newBooking.save()

    res.status(201).json({ message: "Booking created successfully", Data: newBooking })

  } catch (error) { 
    res.status(500).json({ message: "Could not create booking", error: error.message });
  }
}

const getBookings = async (req, res) => {
  try {
    let bookings

    if (req.user.role === "admin") {
      bookings = await Booking.find().populate("user", "username", "email")

    } else {
      bookings = await Booking.find({ user: req.user.id })
    }
    return res.status(200).json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch bookings" });
  }
}

const updateBooking = async (req, res) => {
  try {
    const { serviceName, requestedDate } = req.body
    const { id } = req.params

    if (serviceName === undefined && requestedDate === undefined) {
      return res.status(400).json({ message: "provide service name and requested date to update" })
    }

    const booking = await Booking.findById(id)
    if (!booking) {
      return res.json({ message: "Booking not found" })
    }

    if (req.user.role !== "user" || booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own bookings"
      })
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be updated" });
    }

    if (serviceName !== undefined) {
      if (typeof serviceName !== "string" || !serviceName.trim()) {
        return res.status(400).json({ massage: "Service name must be String" })
      }
      booking.serviceName = serviceName.trim();
    }

    if (requestedDate !== undefined) {
      const bookingDate = new Date(requestedDate)

      if (Number.isNaN(bookingDate.getTime()) || bookingDate <= new Date()) {
        return res.status(400).json({ message: "Please select a valid future date and time" })
      }

      booking.requestedDate = bookingDate;
    }

    await booking.save()

     res.status(200).json({ message: "Booking updated successfully", booking })


  } catch (error) {
     res.status(500).json({ message: "Could not update booking" });
  }
}


const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params

    const booking = await Booking.findById(id)

    if (!booking) {
      return res.json({ message: "Booking not found" })
    }

    if (req.user.role === "admin") {
      await Booking.findByIdAndDelete(id)
      return res.status(200).json({ message: "Booking deleted successfully" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.staus(403).json({ message: "You can only cancel your own bookings" })
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Only pending bookings can be cancelled"
      })
    }

    booking.status = "cancelled"
    await booking.save()

    return res.status(200).json({ message: "Booking cancelled successfully", booking })
  } catch (error) {
     res.json({ message: error.message })
  }
}


const approveBooking = async (req, res) => {
  try {
    const { id } = req.params

    const existBooking = await Booking.findById(id)

    if (!existBooking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (existBooking.status !== "pending") {
      return res.status(400).json({ message: "Only pending booking can be approved" })
    }

    existBooking.status = "approved"
    await existBooking.save()

     res.status(200).json({ message: "Booking approved successfully", existBooking })


  } catch (error) {
    return res.status(500).json({ message: "Could not approve booking" })
  }
}

const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params

    const booking = await Booking.findById(id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (booking.status !== "pending") {
      return res.status(400).json({message: "Only pending bookings can be rejected"})
    }

    booking.status = "rejected"
    await booking.save()

    return res.status(200).json({message : "booking rejected successfully",booking })
  } catch (error) {
 res.status(500).json({message: "Could not reject booking"});
  }
}


module.exports = {createBooking,getBookings,updateBooking,deleteBooking,rejectBooking,approveBooking}