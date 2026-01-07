const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "1234567890";

// route - http://localhost:5000/user/signin
const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({
                msg: "This Email ID is not registered. Try Signing Up instead!",
            });
        }

        if (user.password !== password) {
            return res.status(401).send({
                msg: "Email or Password is wrong",
            });
        }

        return res.status(200).send({
            msg: "Sign-In successful!",
            user_id: user.user_token,
            role: user.role,
            isVerified: user.isVerified
        });
    } catch (error) {
        console.error("SignIn Error:", error);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

// route - http://localhost:5000/user/signup
const signUp = async (req, res) => {
    const { email, username, password, contactNumber, regNumber, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({
                msg: "This Email ID is already registered. Try Signing In instead!",
            });
        }

        const payload = { email };
        const token = jwt.sign(payload, JWT_SECRET);

        const newUser = new User({
            user_token: token,
            reg_number: regNumber,
            username: username,
            email: email,
            contactNumber: contactNumber,
            password: password,
            role: role || "user",
            isVerified: role === "publisher" ? false : true, // Users are verified by default, publishers need approval
        });

        await newUser.save();
        console.log("Signup successful: ", newUser);

        return res.status(200).send({
            msg: "Account creation successful!",
            user_id: token,
        });
    } catch (error) {
        console.error("SignUp Error:", error);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    signUp,
    signIn,
};
