import mongoose from "mongoose";

const Schema = mongoose.Schema;

const replySchema = new Schema(
    {
        body: {
            type: String,
            required: true,
            maxlength: 3000,
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
        },
        downvotes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Reply", replySchema);
