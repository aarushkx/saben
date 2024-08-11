import mongoose, { Schema } from "mongoose";
import {
    hashPassword,
    comparePasswords,
    generateJwtAccessToken,
    generateJwtRefreshToken,
} from "../utils/authUtils.js";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            maxlength: 30,
            minlength: 3,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 128,
            minlength: 6,
        },
        name: {
            type: String,
            required: true,
            maxlength: 30,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 128,
        },
        age: {
            type: Number,
            min: 13,
            max: 150,
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
