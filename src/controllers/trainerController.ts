import { Request, Response } from "express";
import { TrainerType } from "../interfaces/common/types";
import { ITrainerService } from "../interfaces/trainerService.interface";

interface CustomRequest extends Request {
    id?: string;
}


export class TrainerController {
    private _trainerService: ITrainerService;

    constructor(_trainerService: ITrainerService) {
        this._trainerService = _trainerService;
    }
    registerController = async (req: Request, res: Response): Promise<any> => {
        try {
            const trainerData: TrainerType = req.body;
            const serviceResponse = await this._trainerService.registerTrainerService(trainerData);
            if (serviceResponse === "UserExist") {
                console.log(serviceResponse);
                return res.status(400).json({ success: false, message: "User already exists" });
            } else {
                return res.status(200).json({ success: true, message: "OTP sent", otp: serviceResponse });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    googleSignUp = async (req: Request, res: Response): Promise<any> => {
        try {
            const { token, password } = req.body
            const response = await this._trainerService.googleSignUp(token, password)
            if (response == "UserExist") return res.status(400).json({ success: false, message: "User existed please loging" });
            return res.status(200).json({ success: true, message: "Registration successfully" })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    googleLogin = async (req: Request, res: Response) => {
        try {
            const token = req.body.token as string
            const response = await this._trainerService.googleLogin(token)
            if (response === "NotExisted") return res.status(400).json({ message: "User is not existed please register", response })
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    otpVerification = async (req: Request, res: Response): Promise<any> => {
        try {
            const { temperoryEmail, completeOtp } = req.body;
            const serviceResponse = await this._trainerService.otpVerificationService(temperoryEmail, completeOtp);
            if (serviceResponse.message === "OTP verified") {
                return res.status(200).json(serviceResponse);
            } else {
                return res.status(400).json(serviceResponse);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    trainerLogin = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, password } = req.body
            const serviceResponse = await this._trainerService.trainerLoginService(email, password)
            if (serviceResponse.trainerNotExisted) {
                return res.status(403).json({ success: false, message: "Invalid email id" });
            }
            if (serviceResponse.isBlocked) {
                return res.status(403).json({ success: false, message: "Trainer is Blocked by admin" });
            }
            if (!serviceResponse.bcryptPass) {
                return res.status(403).json({ success: false, message: "Incorrect password" });
            }
            if (serviceResponse.verifiedTrainer === "rejected") {
                return res.status(403).json({ success: false, message: "You are rejected by Admin" });
            }
            return res.status(200).json({ success: true, message: "Login successfull", trainerData: serviceResponse.trainerData, accessToken: serviceResponse.accessToken, refreshToken: serviceResponse.refreshToken });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    editTrainerData = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const { name, phone, address, gender, qualification, achivements, feePerMonth, experience } = req.body;
            const trainerId = req.id as string;
            const data = await this._trainerService.editTrainerService(name, phone, address, gender, qualification, achivements, trainerId, feePerMonth, experience);
            return res.status(200).json({ success: true, message: "Updated successfully", data });
        } catch (error: any) {
            if (error.message === "No changes found") {
                return res.status(304).json({ success: false, message: "No changes found" });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    changeTrainerPassword = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.id as string;
            const bcryptPass = await this._trainerService.verifyPassword(oldPassword, userId);
            if (!bcryptPass) {
                return res.status(403).json({ success: false, message: "Current password is incorrect" });
            }
            const serviceResponse = await this._trainerService.changeTrainerPass(newPassword, userId);
            if (serviceResponse.message === "No changes found") {
                return res.status(304).json({ success: false, message: "No changes found" });
            }
            return res.status(200).json({ success: true, message: "Password updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    profileUpdate = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const trainerId = req.id as string;
            const profileImage = req.file;

            if (!profileImage) {
                return res.status(400).json({ success: false, message: 'No profile image uploaded' });
            }

            const response = await this._trainerService.profileUpdate(trainerId, profileImage);

            if ('modifiedCount' in response.result) {
                if (response.result.modifiedCount === 0) {
                    return res.status(304).json({ success: false, message: 'No changes made' });
                } else {
                    return res.status(200).json({ success: true, message: 'Profile updated successfully', profileImage: response.url });
                }
            } else {
                return res.status(500).json({ success: false, message: response.message });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }


    fetchCustomer = async (req: Request, res: Response) => {
        try {
            const { userIds } = req.body
            const response = await this._trainerService.fetchCustomer(userIds)
            console.log("Response : ", response);
            return res.status(200).json({ success: true, message: 'Fetch Customers', customers: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchDeitPlans = async (req: CustomRequest, res: Response) => {
        try {
            const trainerId = req.id as string;
            const response = await this._trainerService.fetchDeitPlans(trainerId)
            return res.status(200).json({ success: true, message: 'Fetch Diets', diet: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    addDietPlan = async (req: CustomRequest, res: Response) => {
        try {
            const trainerId = req.id as string;
            const { dietPlan } = req.body
            const response = await this._trainerService.addDietPlan(trainerId, dietPlan)
            if ('_id' in response) {
                const { _id, ...responseWithoutId } = response;
                return res.status(200).json({
                    success: true,
                    data: responseWithoutId,
                    message: 'Diet plan added successfully',
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchAlreadyChatted = async (req: CustomRequest, res: Response) => {
        try {
            const { alreadyChatted } = req.body;
            const trainerId = req.id as string
            const response = await this._trainerService.fetchAlreadyChatted(alreadyChatted, trainerId);
            return res.status(200).json({
                success: true,
                users: response,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    uploadVideo = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const videoFile = files?.videoFile ? files.videoFile[0] : null;
            const thumbnail = files?.thumbnail ? files.thumbnail[0] : null;
            const trainerId = req.id as string
            const { title, description } = req.body;

            const result = await this._trainerService.saveVideoUrl(trainerId, videoFile, thumbnail, title, description);
            res.status(200).json({ message: "Video uploaded successfully", result });
        } catch (error) {
            console.error("Error uploading video:", error);
            res.status(500).json({ message: "Error uploading video" });
        }
    }

    profileFetch = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const trainerId = req.id as string
            const result = await this._trainerService.profileFetch(trainerId)
            res.status(200).json({ message: "profile fetch successfully", result });
        } catch (error) {
            console.error("Error uploading video:", error);
            res.status(500).json({ message: "Error uploading video" });
        }
    }

    getVideos = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const trainerId = req.id as string
            const page = parseInt(req.query.page as string, 10)
            const result = await this._trainerService.getVideos(trainerId, page)
            res.status(200).json({ message: "video fetch successfully", result });
        } catch (error) {
            res.status(500).json({ message: "Error uploading video" });
        }
    }

    getTransaction = async (req: CustomRequest, res: Response) => {
        try {
            const trainerId = req.id as string
            const response = await this._trainerService.getTransaction(trainerId)
            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    editVideo = async (req: CustomRequest, res: Response) => {
        try {
            const trainerId = req.id as string;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const videoFile = files?.videoFile ? files.videoFile[0] : null;
            const thumbnail = files?.thumbnail ? files.thumbnail[0] : null;

            const { title, description, videoId } = req.body;

            const response = await this._trainerService.editVideoDetails(trainerId, title, description, videoId, videoFile, thumbnail);
            if (response.success) {
                return res.status(200).json({ success: true, message: response.message });
            } else {
                return res.status(400).json({ success: false, message: response.message });
            }
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    }


    toggleVideoListing = async (req: CustomRequest, res: Response) => {
        try {
            const trainerId = req.id as string
            const { videoId, listed } = req.body
            const response = await this._trainerService.toggleVideoListing(trainerId, videoId, listed);
            if (response.success) {
                return res.status(200).json({ success: true, response });
            } else {
                return res.status(400).json({ success: false, response });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    getDashBoardData = async (req: CustomRequest, res: Response) => {
        try {
            const trainerId = req.id as string
            const startDate = req.query.startDate as string
            const endDate = req.query.endDate as string
            const response = await this._trainerService.getDashBoardData(trainerId, startDate, endDate)
            return res.status(200).json({ success: true, response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    getTotalCountOfTrainerData = async (req: CustomRequest, res: Response) => {
        try {
            const trainerId = req.id as string
            const response = await this._trainerService.getTotalCountOfTrainerData(trainerId)
            return res.status(200).json({ success: true, response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    getAllReview = async (req: CustomRequest, res: Response) => {
        try {
            const trainerId = req.id as string
            const response = await this._trainerService.getAllReview(trainerId)
            return res.status(200).json({ success: true, response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    singleTrainerVideo = async (req: CustomRequest, res: Response) => {
        try {
            const videoUrl = req.query.videoUrl as string
            const response = await this._trainerService.singleTrainerVideo(videoUrl)
            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

}