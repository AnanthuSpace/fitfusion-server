import { Schema, model } from "mongoose";
import { ITutorialVideo } from "../interfaces/common/Interfaces";

const tutorialVideoSchema = new Schema<ITutorialVideo>({
    trainerId: {
        type: String,
        required: true,
    },
    videos: [
        {
            videoId: {
                type: String,
                required: true,
            },
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
            category:{
                type: String,
            },
            uploadDate: {
                type: Date,
                default: Date.now,
            },
            listed: {
                type: Boolean,
                default: true
            }
        },
    ],
});

export const TutorialVideoModal = model("TutorialVideo", tutorialVideoSchema);
