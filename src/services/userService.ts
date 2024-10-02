import { UserServiceInterface } from "../interfaces/userService.interface";
import { IUserRepository } from "../interfaces/userRepository.interface";
import { generateAccessToken, generateRefreshToken } from "../config/jwtConfig";
import { EditUserInterface, PaymentSessionResponse } from "../interfaces/common/Interfaces";
import { FullReviewType, TransactionHistory, UserType } from "../interfaces/common/types";
import { getObjectURL, getVideos } from "../config/awsConfig";
import { sendMail } from "../config/nodeMailer";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import Stripe from "stripe";
import dotenv from "dotenv";
import { ITrainerRepository } from "../interfaces/trainerRepository.interface";
import { verifyGoogleToken } from "../config/googleAuth";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

export class UserService implements UserServiceInterface {
    private _userRepository: IUserRepository
    private _trainerRepository: ITrainerRepository

    constructor(userRepository: IUserRepository, trainerRepository: ITrainerRepository) {
        this._userRepository = userRepository;
        this._trainerRepository = trainerRepository
    }

    private otpStore: { [key: string]: { otp: string; timestamp: number; userData: UserType } } = {};


    async registerUserService(userData: UserType) {
        const alreadyExists = await this._userRepository.findEditingData(userData.email);
        if (alreadyExists) {
            return "UserExist";
        }

        const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();

        const isMailSended = await sendMail(userData.email, "otp", OTP);
        if (isMailSended) {
            this.storeOtp(userData.email, OTP, userData);
            return OTP;
        } else {
            return "OTP not sent";
        }
    }

    async googleSignUpUser(token: string, password: string) {
        const userInfo = await verifyGoogleToken(token)
        if (userInfo?.email_verified === true) {
            const name = userInfo.name as string
            const email = userInfo.email as string
            const existedEmail = await this._userRepository.findUser(email)
            if (existedEmail) {
                return "UserExist"
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const userId = v4()
                const result = await this._userRepository.registerThroghGoogle(userId, name, email, hashedPassword)
                const accessToken = generateAccessToken(result.userId)
                const refreshToken = generateRefreshToken(result.userId)
                return { result, accessToken, refreshToken }
            }
        }
    }

    storeOtp(email: string, otp: string, userData: UserType) {
        const timestamp = Date.now();
        this.otpStore[email] = { otp, timestamp, userData };
        console.log("Stored OTP data: ", this.otpStore);
    }

    async otpVerificationService(temperoryEmail: string, otp: string) {

        const storedData = this.otpStore[temperoryEmail];

        if (!storedData) {
            throw new Error("Invalid OTP");
        }

        const currentTime = Date.now();
        const otpTime = storedData.timestamp;
        const difference = currentTime - otpTime;

        if (difference > 2 * 60 * 1000) {
            throw new Error("OTP expired");
        }

        if (storedData.otp !== otp) {
            throw new Error("Invalid OTP");
        }


        const userData = storedData.userData;
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        userData.userId = v4();
        delete this.otpStore[temperoryEmail];

        await this._userRepository.registerUser(userData);

        const accessToken = generateAccessToken(userData.userId);
        const refreshToken = generateRefreshToken(userData.userId);

        const { password, ...userDataWithoutSensitiveInfo } = userData;

        return { message: "OTP verified", accessToken, refreshToken, userData: userDataWithoutSensitiveInfo };
    }

    async userLoginService(email: string) {

        const user = await this._userRepository.findUser(email);
        if (!user) {
            return "Invalid email";
        }

        if (user.isBlocked) {
            return "User is blocked by Admin"
        }
        const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
        const isMailSended = await sendMail(email, "otp", OTP);
        if (isMailSended) {
            this.storeOtp(email, OTP, user);
            return email;
        } else {
            return "OTP not sent";
        }
    }

    async userLoginVerificationService(email: string, otp: string) {
        const storedData = this.otpStore[email];
        if (!storedData) {
            throw new Error("Invalid OTP");
        }

        const currentTime = Date.now();
        const otpTime = storedData.timestamp;
        const difference = currentTime - otpTime;

        if (difference > 2 * 60 * 1000) {
            throw new Error("OTP expired");
        }

        if (storedData.otp !== otp) {
            throw new Error("Invalid OTP");
        }

        const user = await this._userRepository.findUser(email);
        if (!user) {
            throw new Error("User not found");
        }

        await this._userRepository.activeUser(email)
        delete this.otpStore[email];

        const accessToken = generateAccessToken(user.userId);
        const refreshToken = generateRefreshToken(user.userId);

        return { message: "OTP verified", accessToken, refreshToken, userData: user };
    }

    async googleLoginUser(token: string) {
        try {
            const userInfo = await verifyGoogleToken(token)
            if (userInfo?.email_verified === true) {
                const email = userInfo.email as string
                const existedEmail = await this._userRepository.findUser(email)
                if (!existedEmail) {
                    return "NotExisted"
                } else {
                    await this._userRepository.activeUser(email)
                    const accessToken = generateAccessToken(existedEmail.userId);
                    const refreshToken = generateRefreshToken(existedEmail.userId);
                    return { message: "Login successfully", accessToken, refreshToken, userData: existedEmail };
                }
            }
        } catch (error: any) {
            return { success: false, message: error.message || "Internal server error" };
        }
    }

    async inactiveUser(userId: string) {
        try {
            const result = await this._userRepository.inactiveUser(userId)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || "Internal server error" };
        }
    }


    async editUserService(name: string, phone: string, address: string, gender: string, password: string, userId: string, weight: string, heigth: string, activityLevel: string, goals: string, dietary: string, medicalDetails: string) {
        const hashPassword = await bcrypt.hash(password, 10);
        const editUserData: EditUserInterface = {
            name,
            phone,
            address,
            gender,
            password: hashPassword,
            weight,
            heigth,
            activityLevel,
            goals,
            dietary,
            medicalDetails
        }
        const res = await this._userRepository.editUser(editUserData, userId)
        if (!res.modifiedCount) {
            throw new Error("No changes found")
        }
        return { message: "Updated successfully" };
    }

    async verifyPassword(password: string, userId: string): Promise<boolean> {
        try {
            const user = await this._userRepository.findEditingData(userId);
            const storedPassword = user?.password;
            const bcryptPass = await bcrypt.compare(password, String(storedPassword));
            return bcryptPass;
        } catch (error) {
            console.error("Error verifying password: ", error);
            return false;
        }
    }

    async changeUserPass(newPassword: string, userId: string) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const res = await this._userRepository.changePass(hashedPassword, userId);
            if (res.modifiedCount === 0) {
                throw new Error("No changes found");
            }
            return { success: true, message: "Reset Password successfully" };
        } catch (error: any) {
            console.error("Error in reset password: ", error);
            return { success: false, message: error.message || "Internal server error" };
        }
    }

    async fetchTrainers() {
        try {
            let trainers = await this._userRepository.fetchTrainers();

            trainers = await Promise.all(trainers.map(async (trainer: any) => {
                const profileIMG = await getObjectURL(`trainerProfile/${trainer.profileIMG}`);
                return { ...trainer, profileIMG };
            }));
            return trainers;
        } catch (error: any) {
            console.error("Error fetching trainers: ", error);
            return { success: false, message: error.message || "Internal server error" };
        }
    }


    async addUserDetails(userId: string, userDetails: UserType) {
        try {
            const result = await this._userRepository.addUserDetails(userId, userDetails)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || "Internal server error" };
        }
    }

    async blockUser(userId: string) {
        try {
            const result = await this._userRepository.blockUser(userId)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || "Internal server error" };
        }
    }

    async createCheckoutSession(trainerId: string, trainerName: string, amount: number, userId: string, userName: string): Promise<PaymentSessionResponse> {
        const trainer = await this._trainerRepository.findEditingData(trainerId);
        if (!trainer) {
            throw new Error('Trainer not found');
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Trainer Subscription",
                            metadata: { trainerId },
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.localhostURL}payment-success`,
            cancel_url: `${process.env.localhostURL}payment-failed`,
            metadata: {
                trainerId,
                userId,
            }
        });

        const userData = await this._userRepository.updateUserAfterPayment(userId, trainerId, trainerName, amount);
        const trainerData = await this._trainerRepository.updateTrainerSubscription(trainerId, userId, userName, amount);

        return { session, userData, trainerData };
    }

    async fetchUserTrainer(userId: string) {
        try {
            const trainersData = await this._userRepository.fetchTrainers()
            const userData = await this._userRepository.fetchUser(userId)
            return { trainersData, userData }
        } catch (error: any) {
            console.error("Error in reset password: ", error);
            return { trainersData: [], userData: null };
        }
    }

    async fetchAlreadyChattedTrainer(alreadyChatted: string[]) {
        try {
            const trainers = await this._userRepository.fetchAlreadyChattedTrainer(alreadyChatted);
            return trainers
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchDeitPlans(trainerId: string) {
        try {
            let diet = await this._userRepository.fetchDeitPlans(trainerId);
            return diet;
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchTrainerScroll(page: number) {
        try {
            let trainers = await this._userRepository.fetchTrainerScroll(page);
            trainers = await Promise.all(trainers.map(async (trainer: any) => {
                const profileIMG = await getObjectURL(`trainerProfile/${trainer.profileIMG}`);
                return { ...trainer, profileIMG };
            }));
            return trainers;
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async addReview({ trainerId, reviewData, curruntRating, reviewCount }: { trainerId: string; reviewData: FullReviewType, curruntRating: number, reviewCount: number }) {
        try {
            const newRating = reviewData.rating;
            const updatedTotalRating = curruntRating * reviewCount + newRating;
            const updatedReviewCount = reviewCount + 1;
            const updatedAverageRating = updatedTotalRating / updatedReviewCount;

            const result = await this._userRepository.addReview(reviewData, trainerId);

            if (result && 'modifiedCount' in result && result.modifiedCount === 1) {
                await this._trainerRepository.ratingUpdate(trainerId, updatedAverageRating);
                return updatedAverageRating;
            } else {
                throw new Error('Failed to add review: No document was modified.');
            }
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchReview(trainerId: string) {
        try {
            const result = await this._userRepository.fetchReview(trainerId)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchSingleTrainer(trainerId: string) {
        try {
            let result = await this._userRepository.fetchSingleTrainer(trainerId)
            console.log(result);

            const url = await getObjectURL(`trainerProfile/${result.profileIMG}`)
            result = { ...result, profileIMG: url }
            console.log(result);

            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchVideos(trainerId: string): Promise<any> {
        try {
            let tutorialVideo = await this._userRepository.fetchVideos(trainerId)
            const videosWithUrls = await Promise.all(
                tutorialVideo.videos.map(async (video: any) => {
                    const videoURL = await getVideos(`trainer/Videos/${video.videoUrl}`);
                    const thumbnailURL = await getVideos(`trainer/thumbnails/${video.thumbnail}`);

                    return {
                        ...video,
                        videoUrl: videoURL,
                        thumbnail: thumbnailURL,
                    };
                })
            );
            return { success: true, videos: videosWithUrls };
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchAllVideos(trainerIds: string[]): Promise<any> {
        try {
            let videosList = await this._userRepository.fetchAllVideos(trainerIds);
            videosList = videosList.flat();
            let allVideosWithUrlsId = videosList.map((trainer: any) => {
                return trainer.videos.map((video: any) => ({
                    videoUrl: video.videoUrl,
                    thumbnail: video.thumbnail,
                    uploadDate: video.uploadDate,
                    title: video.title,
                    description: video.description
                }));
            }).flat();

            const allVideosWithUrls = await Promise.all(
                allVideosWithUrlsId.map(async (video: any) => {
                    const videoLink = await getVideos(`trainer/Videos/${video.videoUrl}`)
                    const thumbnailLink = await getVideos(`trainer/thumbnails/${video.thumbnail}`)

                    return {
                        ...video,
                        videoUrl: videoLink,
                        thumbnail: thumbnailLink
                    }
                })
            )

            return allVideosWithUrls

        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async getTransactionHostory(userId: string): Promise<TransactionHistory[] | any> {
        try {
            const result = await this._userRepository.getTransactionHostory(userId)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

}
