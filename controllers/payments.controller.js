const { instance } = require("../config/razorpay");
const Course = require("../models/course.model");
const User = require("../models/user.model");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the razorpay order
exports.capturePayment = async (req, res) => {
  try {
    //get course id and user id
    const { courseId } = req.body;
    const userId = req.user.id;
    //validation
    //valid course id
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide valid course id" });
    }
    // valid course details
    let course;
    try {
      course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(401)
          .json({ success: false, message: "Couldn't find the course" });
      }

      //user already pay for the same course
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(400)
          .json({ success: false, message: "Student is already enrolled" });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    //order create
    const amount = course.price;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      recipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: courseId,
        userId,
      },
    };
    try {
      //inittate the payment using razor pay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);
      //return response
      return res.status(200).json({
        success: true,
        message: "Payment initated Successfully",
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Could not initiate the orders" });
    }
    //return response
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error in capturing payment" });
  }
};

//verify signature of razorpay and server
exports.verifySignature = async (req, res) => {
  try {
    const webhookSecret = "12345678";
    const signature = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    if (signature === digest) {
      console.log("Payment is authorized");
      const { courseId, userId } = req.body.payload.payment.entity.notes;
      try {
        //fullfill the action
        //find the course and enrolled the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        );
        if (!enrolledCourse) {
          return res.status(500).json({
            success: false,
            message: "Course Not Found",
          });
        }
        console.log(enrolledCourse);
        //find the students and add the course to list enrolled courses
        const enrolledStudent = await User.findOneAndUpdate(
          { _id: userid },
          { $push: { courses: courseId } },
          { new: true }
        );
        console.log(enrolledStudent);
        //mail send of confirmation
        const emailResponse = await mailSender(
          enrolledStudent.email,
          "Congats for New Course",
          "Congratulation, you are onboarded into new Course"
        );
        console.log(emailResponse);
        return res.status(200).json({
          success: true,
          message: "Signatur verifed and course added",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Signatur verifed and course added failed",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Request",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signatur verifed and course added failed",
    });
  }
};
