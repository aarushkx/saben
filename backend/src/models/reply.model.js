import mongoose, { Schema } from "mongoose";

const replySchema = new Schema(
    {
        body: {
            type: String,
            required: true,
            maxlength: 3000,
            minlength: 3,
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
    },
    {
        timestamps: true,
    }
);

export const Reply = mongoose.model("Reply", replySchema);
