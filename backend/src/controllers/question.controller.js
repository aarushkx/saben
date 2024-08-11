import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/question.model.js";
import { Reply } from "../models/reply.model.js";

const createQuestion = asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const author = req.user._id;

    if (!title || !body) {
        throw new ApiError(400, "Title and body are required");
    }

    const question = await Question.create({ title, body, author });

    return res
        .status(201)
        .json(new ApiResponse(201, question, "Question created"));
});

const getQuestions = asyncHandler(async (_, res) => {
    const questions = await Question.find()
        .populate({
            path: "author",
            select: "name username age",
        })
        .populate("replies");

    return res
        .status(200)
        .json(new ApiResponse(200, questions, "Questions retrieved"));
});

const getQuestionById = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id)
        .populate({
            path: "author",
            select: "name username age",
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
    console.log("Question deleted");

    return res.status(200).json(new ApiResponse(200, {}, "Question deleted"));
});

export { createQuestion, getQuestions, getQuestionById, deleteQuestion };
