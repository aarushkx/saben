import mongoose, { Schema } from "mongoose";

const replySchema = new Schema(
    {
        body: {
            type: String,
            required: true,
            maxlength: [3000, 'Reply cannot exceed 3000 characters'],
            minlength: [3, 'Reply must be at least 3 characters'],
            trim: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        question: {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
        upvotes: {
            type: Number,
            default: 0,
            min: [0, 'Upvotes cannot be negative'],
        },
        downvotes: {
            type: Number,
            default: 0,
            min: [0, 'Downvotes cannot be negative'],
        },
    },
    {
        timestamps: true,
    }
);

export const Reply = mongoose.model("Reply", replySchema);
