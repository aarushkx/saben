import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Reply } from "../models/reply.model.js";
import { Question } from "../models/question.model.js";

const createReply = asyncHandler(async (req, res) => {
    const { body, questionId } = req.body;
    const author = req.user._id;

    if (!body || !questionId) {
        throw new ApiError(400, "Body and question ID are required");
    }
    if (body.length < 3) {
        throw new ApiError(400, "Reply must be at least 3 characters long");
    }
    if (body.length > 3000) {
        throw new ApiError(400, "Reply cannot have more than 3000 characters");
    }

    const question = await Question.findById(questionId);
    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    const reply = await Reply.create({ body, author, question: questionId });

    return res.status(201).json(new ApiResponse(201, reply, "Reply created"));
});

const getRepliesForQuestion = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (pageNumber <= 0 || pageSize <= 0) {
        throw new ApiError(400, "Page and limit must be positive integers");
    }

    const replies = await Reply.find({ question: questionId })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate("author", "-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, replies, "Replies retrieved successfully"));
});

const deleteReply = asyncHandler(async (req, res) => {
    const replyId = req.params.id;
    const userId = req.user._id;

    const reply = await Reply.findById(replyId);
    if (!reply) {
        throw new ApiError(404, "Reply not found");
    }
    if (reply.author.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to delete this reply");
    }

    await Reply.findByIdAndDelete(replyId);

    return res.status(200).json(new ApiResponse(200, {}, "Reply deleted"));
});

export { createReply, getRepliesForQuestion, deleteReply };
