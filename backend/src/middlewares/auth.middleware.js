import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Access denied. No token provided");
        }

        const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        const user = await User.findById(payload._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid token");
    }
});
