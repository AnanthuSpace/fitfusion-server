import { Schema, model } from "mongoose";
import { ITutorialVideo } from "../interfaces/common/Interfaces";

const tutorialVideoSchema = new Schema<ITutorialVideo>({
    trainerId: {
        type: String,
        required: true,
    },
    videos: [
        {
            url: {
                type: String,
                required: true, 
            },
            title: {
                type: String,
                required: true, 
            },
            description: {
                type: String, 
            },
            uploadDate: {
                type: Date,
                default: Date.now,
            },
        },
    ],
});

export const TutorialVideoModal = model("TutorialVideo", tutorialVideoSchema);
