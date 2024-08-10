import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 400,
        },
        body: {
            type: String,
            // required: true,
            maxlength: 1000,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        replies: [
            {
                type: Schema.Types.ObjectId,
                ref: "Reply",
            },
        ],
        // tags: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: "Tag",
        //     },
        // ],
    },
    {
        timestamps: true,
    }
);

export const Question = mongoose.model("Question", questionSchema);
