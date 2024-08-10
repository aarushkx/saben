import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error(`Error hashing password: ${error.message}`);
    }
};

export const comparePasswords = async (enteredPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    } catch (error) {
        throw new Error(`Error comparing passwords: ${error.message}`);
    }
};

export const generateJwtAccessToken = (user) => {
    try {
        return jwt.sign(
            {
                _id: user._id,
                email: user.email,
                username: user.username,
                name: user.name,
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
            }
        );
    } catch (error) {
        throw new Error(`Error generating access token: ${error.message}`);
    }
};

export const generateJwtRefreshToken = (user) => {
    try {
        return jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
            }
        );
    } catch (error) {
        throw new Error(`Error generating refresh token: ${error.message}`);
    }
};