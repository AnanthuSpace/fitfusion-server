import { Schema, model } from "mongoose";
import { ReviewType } from "../interfaces/common/types";

const reviewSchema = new Schema<ReviewType>({
    trainerId: {
        type: String,
        required: true,
    },
    review: [{
        userName: String,
        rating: Number,
        feedback: String,
    }
    ]
})

const ReviewModal = model<ReviewType>("Review", reviewSchema)
export { ReviewModal }