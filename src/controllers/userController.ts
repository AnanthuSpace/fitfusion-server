import { Request, response, Response } from "express";
import { UserType } from "../interfaces/common/types";
import { UserServiceInterface } from "../interfaces/userService.interface";

interface CustomRequest extends Request {
    id?: string;
}

export class UserController {
    private _userService: UserServiceInterface;

    constructor(_userService: UserServiceInterface) {
        this._userService = _userService
    }

    registerController = async (req: Request, res: Response): Promise<any> => {
        try {
            const userData: UserType = req.body;
            const serviceResponse = await this._userService.registerUserService(userData);
            if (serviceResponse === "UserExist") {
                return res.status(409).json({ success: false, message: "User already exists" });
            } else {
                return res.status(200).json({ success: true, message: "OTP sent to your email", validity: 120 });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    resendOtp = async (req: Request, res: Response): Promise<any> => {
        try {
            const email = req.body.emailId as string
            await this._userService.resendOtp(email)
            return res.status(200).json({ success: true, message: "OTP sent", validity: 120 });
        } catch (error) {
            if (error == "emailNotFound") {
                return res.status(409).json({ success: false, message: "Sorry for the inconvenience, please register again." });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    forgotOtp = async (req: Request, res: Response): Promise<any> => {
        try {
            const email = req.body.emailId as string
            const result = await this._userService.forgotOtp(email)
            if (result === "Invalid email Id") {
                return res.status(409).json({
                    success: false,
                    message: "Email not found. Please register."
                });

            } else {
                return res.status(200).json({ success: true, message: "OTP sent", validity: 120 });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    verifyOTP = async (req: Request, res: Response): Promise<any> => {
        try {
            const email = req.body.email as string
            const otp = req.body.otp as string
            const result = await this._userService.verifyOTP(email, otp)
            return res.status(200).json({ success: result });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    resetPassword = async (req: Request, res: Response): Promise<any> => {
        try {
            const { newPassword } = req.body.values
            const email = req.body.email as string
            const result = await this._userService.resetPassword(email, newPassword)
            console.log(result)
            return res.status(200).json({ success: true })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    otpVerification = async (req: Request, res: Response): Promise<any> => {
        try {
            const { temperoryEmail, completeOtp } = req.body;
            const serviceResponse = await this._userService.otpVerificationService(temperoryEmail, completeOtp);

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

    userLogin = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, password } = req.body;
            const serviceResponse = await this._userService.userLoginService(email, password);
            return res.status(200).json({ success: true, message: "Login successful", data: serviceResponse });
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message || "Internal server error";
            return res.status(400).json({ success: false, message: errorMessage });
        }
    }


    loginVerify = async (req: Request, res: Response): Promise<any> => {
        try {
            const { temperoryEmail, completeOtp } = req.body;

            console.log(temperoryEmail);
            const serviceResponse = await this._userService.userLoginVerificationService(temperoryEmail, completeOtp);

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

    googleSignUpUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const { token, password } = req.body
            const response = await this._userService.googleSignUpUser(token, password)
            if (response == "UserExist") return res.status(400).json({ success: false, message: "User existed please loging" });
            return res.status(200).json({ success: true, message: "Registration successfully", data: response })
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    googleLoginUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const token = req.body.token
            const response = await this._userService.googleLoginUser(token)
            if (response === "NotExisted") return res.status(400).json({ message: "User is not existed please register", response })
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    editUserData = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const { name, phone, address, gender, password, weight, heigth, activityLevel, goals, dietary, medicalDetails } = req.body;
            const userId = req.id as string;
            const bcryptPass = await this._userService.verifyPassword(password, userId);
            if (!bcryptPass) {
                return res.status(403).json({ success: false, message: "Invalid password" });
            }
            await this._userService.editUserService(name, phone, address, gender, password, userId, weight, heigth, activityLevel, goals, dietary, medicalDetails);
            return res.status(200).json({ success: true, message: "Updated successfully" });
        } catch (error: any) {
            if (error.message === "No changes found") {
                return res.status(304).json({ success: false, message: "No changes found" });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    inactiveUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.body
            await this._userService.inactiveUser(userId)
            return res.status(200).json({ success: true, message: "User is inactive" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    changeUserPassword = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.id as string;
            const bcryptPass = await this._userService.verifyPassword(oldPassword, userId);
            if (!bcryptPass) {
                return res.status(403).json({ success: false, message: "Current password is incorrect" });
            }
            const serviceResponse = await this._userService.changeUserPass(newPassword, userId);
            if (serviceResponse.message === "No changes found") {
                return res.status(304).json({ success: false, message: "No changes found" });
            }
            return res.status(200).json({ success: true, message: "Password updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    blockeAUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const { userId } = req.body
            const responds = await this._userService.blockUser(userId)
            if (responds) {
                return res.status(200).json({ success: true, message: "User blocked" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    fetchTrainers = async (req: Request, res: Response): Promise<any> => {
        try {
            const trainers = await this._userService.fetchTrainers()
            if (trainers) {
                return res.status(200).json(trainers)
            }
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    fetchUserTrainer = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const userId = req.id as string
            const response = await this._userService.fetchUserTrainer(userId)
            return res.status(200).json(response)
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    addUserDetails = async (req: CustomRequest, res: Response): Promise<any> => {
        try {
            const { userDetails } = req.body
            const userId = req.id as string;
            const response = await this._userService.addUserDetails(userId, userDetails)

            if ('modifiedCount' in response) {
                if (response.modifiedCount === 0) {
                    return res.status(304).json({ success: false, message: 'No changes made' });
                } else {
                    return res.status(200).json({ success: true, message: 'Profile updated successfully' });
                }
            } else {
                return res.status(500).json({ success: false, message: response.message });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    }


    createCheckoutSession = async (req: CustomRequest, res: Response): Promise<void> => {
        try {
            const { trainerId, trainerName, amount, userName }: { trainerId: string; trainerName: string; amount: number, userName: string } = req.body;
            const userId = req.id as string;

            const result = await this._userService.createCheckoutSession(trainerId, trainerName, amount, userId, userName);

            res.status(200).json({ sessionId: result.session.id });
        } catch (error: any) {
            console.log(error);

            res.status(500).json({
                message: "Failed to create checkout session",
                error: error.message,
            });
        }
    }

    verifyThePayment = async (req: Request, res: Response): Promise<any> => {
        try {
            const session_id = req.query.session_id as string
            const response = await this._userService.verifyThePayment(session_id)
            if (response.success) {
                return res.redirect(302, `${process.env.clientURL}/payment-success`);
            }
        } catch (error: any) {
            res.status(500).json({ message: 'Error verifying payment', error: error.message });
        }
    };

    canclePayment = async (req: Request, res: Response): Promise<any> => {
        try {
            return res.redirect(`${process.env.clientURL}/payment-failed`);
        } catch (error: any) {
            res.status(500).json({ message: 'Error verifying payment', error: error.message });
        }
    }

    fetchAlreadyChattedTrainer = async (req: CustomRequest, res: Response) => {
        try {
            const { alreadyChatted } = req.body;
            const userId = req.id as string
            const response = await this._userService.fetchAlreadyChattedTrainer(alreadyChatted, userId);
            return res.status(200).json({
                success: true,
                users: response,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchDeitPlans = async (req: Request, res: Response) => {
        try {
            const trainerId = req.query.trainerId as string;
            const response = await this._userService.fetchDeitPlans(trainerId)
            return res.status(200).json({ success: true, deit: response })
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchTrainerScroll = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page);
            const response = await this._userService.fetchTrainerScroll(page)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    addReview = async (req: Request, res: Response) => {
        try {
            const { trainerId, reviewData, curruntRating, reviewCount } = req.body
            const response = await this._userService.addReview({ trainerId: trainerId, reviewData: reviewData, curruntRating: curruntRating, reviewCount: reviewCount })
            return res.status(200).json({ success: true, rating: response })
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchReview = async (req: Request, res: Response) => {
        try {
            const trainerId = req.query.trainerId as string;
            const response = await this._userService.fetchReview(trainerId)
            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchSingleTrainer = async (req: Request, res: Response) => {
        try {
            const trainerId = req.query.trainerId as string
            const response = await this._userService.fetchSingleTrainer(trainerId)
            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchVideos = async (req: Request, res: Response) => {
        try {
            const trainerId = req.query.trainerId as string
            const response = await this._userService.fetchVideos(trainerId)
            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchAllVideos = async (req: Request, res: Response) => {
        try {
            const trainerIds = req.query.subcriptionList as string[]
            const response = await this._userService.fetchAllVideos(trainerIds)
            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    getTransactionHostory = async (req: CustomRequest, res: Response) => {
        try {
            const userId = req.id as string
            const response = await this._userService.getTransactionHostory(userId)
            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    fetchSingleVideo = async (req: CustomRequest, res: Response) => {
        try {
            const videoUrl = req.query.videoUrl as string
            const response = await this._userService.fetchSingleVideo(videoUrl)
            return res.status(200).json({ success: true, data: response });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}