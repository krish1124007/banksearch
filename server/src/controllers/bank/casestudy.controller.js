import { CaseStudy } from "../../models/casestudy.model.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/apiresponse.js";

// Create a new case study
const createCaseStudy = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json(
            new ApiResponse(400, "Title and description are required", { success: false })
        );
    }

    const caseStudy = await CaseStudy.create({ title, description });

    return res.status(200).json(
        new ApiResponse(200, "Case study created successfully", { success: true, data: caseStudy })
    );
});

// Get all case studies (with optional search by title)
const getAllCaseStudies = asyncHandler(async (req, res) => {
    const { search } = req.query;

    const filter = search
        ? { title: { $regex: search, $options: "i" } }
        : {};

    const caseStudies = await CaseStudy.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, "Case studies fetched successfully", { success: true, data: caseStudies })
    );
});

// Delete a case study
const deleteCaseStudy = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json(
            new ApiResponse(400, "ID is required", { success: false })
        );
    }

    const deleted = await CaseStudy.findByIdAndDelete(id);

    if (!deleted) {
        return res.status(404).json(
            new ApiResponse(404, "Case study not found", { success: false })
        );
    }

    return res.status(200).json(
        new ApiResponse(200, "Case study deleted successfully", { success: true })
    );
});

// Update a case study
const updateCaseStudy = asyncHandler(async (req, res) => {
    const { id, title, description } = req.body;

    if (!id) {
        return res.status(400).json(
            new ApiResponse(400, "ID is required", { success: false })
        );
    }

    const updated = await CaseStudy.findByIdAndUpdate(
        id,
        { title, description },
        { new: true, runValidators: true }
    );

    if (!updated) {
        return res.status(404).json(
            new ApiResponse(404, "Case study not found", { success: false })
        );
    }

    return res.status(200).json(
        new ApiResponse(200, "Case study updated successfully", { success: true, data: updated })
    );
});

export { createCaseStudy, getAllCaseStudies, deleteCaseStudy, updateCaseStudy };
