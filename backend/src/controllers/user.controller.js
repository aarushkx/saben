import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateJwtAccessToken();
        const refreshToken = user.generateJwtRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Failed to generate access and refresh tokens");
    }
};

const options = {
    httpOnly: true,
    secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, age, email, username, password } = req.body;

    if (
        [name, age, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "Please fill in all fields");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    if (name.length < 3) {
        throw new ApiError(400, "Name must be at least 3 characters long");
    }
    if (name.length > 30) {
        throw new ApiError(400, "Name cannot be more than 30 characters");
    }
    if (age < 13) {
        throw new ApiError(
            400,
            "You must be at least 13 years old to register"
        );
    }
    if (age > 150) {
        throw new ApiError(400, "Invalid age");
    }
    if (
        !email.includes("@") ||
        !email.includes(".") ||
        email.length < 6 ||
        email.length > 128
    ) {
        throw new ApiError(400, "Invalid email");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email");
    }
    if (username.length < 3) {
        throw new ApiError(400, "Username must be at least 3 characters long");
    }
    if (username.length > 30) {
        throw new ApiError(400, "Username cannot be more than 30 characters");
    }
    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }
    if (password.length > 128) {
        throw new ApiError(400, "Password cannot exceed 128 characters");
    }

    const user = await User.create({
        name,
        age,
        email,
        username: username.toLowerCase(),
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User created"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Please provide email or username");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordMatched = await user.isPasswordMatched(password);
    if (!isPasswordMatched) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: null },
        },
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Access denied. No token provided");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User retrieved successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
};
