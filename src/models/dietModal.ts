import { Schema, model } from "mongoose";
import { IDietPlan, IMeal } from "../interfaces/common/Interfaces";

const mealSchema = new Schema<IMeal>({
    mealTime: { type: String, required: true },
    items: [{ type: String, required: true }]
}, { _id: false });

const dietPlanSchema = new Schema<IDietPlan>({
    trainerId: {
        type: String,
        required: true
    },
    dietName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    meals: [mealSchema]
});

const DietPlan = model<IDietPlan>('DietPlan', dietPlanSchema);

export default DietPlan;
