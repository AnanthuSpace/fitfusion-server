import { Schema, model } from "mongoose";
import { ITutorialVideo } from "../interfaces/common/Interfaces";

const tutorialVideoSchema = new Schema<ITutorialVideo>({
    trainerId: {
        type: String,
        required: true,
    },
    videos: [
        {
            videoUrl: {
                type: String,
                required: true, 
            },
            thumbnail: {
                type: String,
                require: true
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
