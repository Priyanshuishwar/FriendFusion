import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js"; // use this helper

export async function signup(req, res) {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) { // match your schema minlength
            return res.status(400).json({ message: "Password must be at least 10 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, please use a different email" });
        }

        // hash password before saving (if not handled in User model)
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        const indx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${indx}.png`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        // Create the user in Stream
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic,
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.error("Error creating Stream user", error);
        }

        // Generate JWT
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        // Send JWT as cookie
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.error("Error in signup controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Invalid email or password" });

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout successful" });
}


export async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        // Check required fields
        const missingFields = [];
        if (!fullName) missingFields.push("fullName");
        if (!bio) missingFields.push("bio");
        if (!nativeLanguage) missingFields.push("nativeLanguage");
        if (!learningLanguage) missingFields.push("learningLanguage");
        if (!location) missingFields.push("location");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields,
            });
        }

        // Update user
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnboarded: true,
            },
            { new: true }
        );

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }
        // TODO: Update the user info into stream

        try{
            await upsertStreamUser({
                id: updateUser._id.toString(),
                name: updateUser,fullName,
                image: updateUser.profilePic || "",
            });
            console.log(`Stream user updated after onboarding for${updateUser.fullName}`);
        }
        catch(streamError){
            console.log("Error updating stream user during onboarding:",streamError.message);
        }

        res.status(200).json({ success: true, user: updateUser });
    } catch (error) {
        console.error("Onboarding error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
