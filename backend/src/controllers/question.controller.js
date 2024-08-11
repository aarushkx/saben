import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/question.model.js";

const createQuestion = asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const author = req.user._id;

    if (!title || !body) {
        throw new ApiError(400, "Title and body are required");
    }
    if (title.length > 400) {
        throw new ApiError(400, "Title cannot be more than 400 characters");
    }
    if (body.length > 1000) {
        throw new ApiError(400, "Body cannot be more than 1000 characters");
    }

    const question = await Question.create({ title, body, author });

    return res
        .status(201)
        .json(new ApiResponse(201, question, "Question created"));
});

const getQuestions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    if (pageNumber <= 0 || pageSize <= 0) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {},
                    "Page and limit must be positive integers"
                )
            );
    }

    try {
        const questions = await Question.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .populate({
                path: "author",
                select: "-password -refreshToken",
            })
            .populate("replies");

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    questions,
                    "Questions retrieved successfully"
                )
            );
    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to retrieve questions"));
    }
});

const getQuestionById = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id)
        .populate({
            path: "author",
            select: "-password -refreshToken",
        })
        .populate("replies");

    if (!question) {
        throw new ApiError(404, "Question not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, question, "Question retrieved"));
});

const deleteQuestion = asyncHandler(async (req, res) => {
    const questionId = req.params.id;
    const userId = req.user._id;

    const question = await Question.findById(questionId);
    if (!question) {
        throw new ApiError(404, "Question not found");
    }
    if (question.author.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to delete this question");
    }

    await Question.findByIdAndDelete(questionId);
    console.log("Question deleted successfully");

    return res.status(200).json(new ApiResponse(200, {}, "Question deleted"));
});

export { createQuestion, getQuestions, getQuestionById, deleteQuestion };
