import mongoose from "mongoose";
// import bcrypt from "bcrypt";
import { hashPassword, comparePasswords, generateJwtAccessToken, generateJwtRefreshToken } from "../utils/authUtils";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Please enter a username"],
            unique: true,
            lowercase: true,
            maxlength: [30, "Username cannot be more than 30 characters"],
            minlength: [3, "Username must be at least 3 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please enter an email"],
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: [100, "Email cannot be more than 100 characters"],
            minlength: [6, "Email must be at least 6 characters"],
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email!`,
            },
        },
        name: {
            type: String,
            required: [true, "Please enter your name"],
            maxlength: [30, "Name cannot be more than 30 characters"],
        },
        avatar: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            required: true,
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
            minlength: [8, "Password must be at least 8 characters long"],
            maxlength: [128, "Password cannot exceed 128 characters"],
            validate: {
                validator: function (v) {
                    const passwordRegex =
                        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;
                    return passwordRegex.test(v);
                },
                message:
                    "Password must be between 8 and 128 characters, include at least one letter, one number, and one special character.",
            },
        },
        age: {
            type: Number,
            min: [13, "Age must be at least 13"],
            max: [150, "Invalid age"],
            validate: {
                validator: Number.isInteger,
                message: "Age must be an integer",
            },
        },
        refreshToken: {
            type: String,
        },
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Reply",
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return comparePasswords(enteredPassword, this.password);
};

userSchema.methods.generateJwtAccessToken = function () {
    return generateJwtAccessToken(this);
};

userSchema.methods.generateJwtRefreshToken = function () {
    return generateJwtRefreshToken(this);
};

export const User = mongoose.model("User", userSchema);
