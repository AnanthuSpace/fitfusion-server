import { sendMail } from "../config/nodeMailer";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { TrainerHistory, TrainerType } from "../interfaces/common/types";
import { generateAccessToken, generateRefreshToken } from "../config/jwtConfig";
import { EditTrainerInterface, IDietPlan } from "../interfaces/common/Interfaces";
import { ProfileUpdateResult } from "../interfaces/common/Interfaces";
import { ITrainerService } from "../interfaces/trainerService.interface";
import { ITrainerRepository } from "../interfaces/trainerRepository.interface";
import { getObjectURL, getVideos, UpdateToAws } from "../config/awsConfig";
import { verifyGoogleToken } from "../config/googleAuth";

export class TrainerService implements ITrainerService {
    private _trainerRepository: ITrainerRepository

    constructor(trainerRepository: ITrainerRepository) {
        this._trainerRepository = trainerRepository;
    }
    private otpStore: { [key: string]: { otp: string; timestamp: number; trainerData: TrainerType } } = {};

    async registerTrainerService(trainerData: TrainerType) {
        const alreadyExists = await this._trainerRepository.findTrainerInRegister(trainerData.email);
        if (alreadyExists) {
            return "UserExist";
        }

        const OTP: string = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("Generated OTP: ", OTP);
        const isMailSended = await sendMail(trainerData.email, "otp", OTP);
        if (isMailSended) {
            this.storeOtp(trainerData.email, OTP, trainerData);
            console.log("OTP stored successfully");
            return OTP;
        } else {
            return "OTP not sent";
        }
    }


    storeOtp(email: string, otp: string, trainerData: TrainerType) {
        const timestamp = Date.now();
        this.otpStore[email] = { otp, timestamp, trainerData };
        console.log("Stored OTP data: ", this.otpStore);
    }


    async otpVerificationService(temperoryEmail: string, otp: string): Promise<{ message: string; trainerData: Omit<TrainerType, "password"> }> {
        console.log("Current OTP store: ", this.otpStore);
        console.log("Verifying OTP for email: ", temperoryEmail);

        const storedData = this.otpStore[temperoryEmail];
        console.log("storedData: ", storedData);

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

        console.log("OTP matched");

        const trainerData = storedData.trainerData;
        const hashedPassword = await bcrypt.hash(trainerData.password, 10);
        trainerData.password = hashedPassword;
        trainerData.trainerId = v4();
        delete this.otpStore[temperoryEmail];

        await this._trainerRepository.registerTrainer(trainerData);

        const { password, ...trainerDataWithoutSensitiveInfo } = trainerData;

        return { message: "OTP verified", trainerData: trainerDataWithoutSensitiveInfo as Omit<TrainerType, "password"> };
    }



    async trainerLoginService(email: string, enteredPassword: string): Promise<any> {
        try {
            const trainerData = await this._trainerRepository.findTrainerInRegister(email);
            if (!trainerData) {
                return {
                    trainerNotExisted: true,
                    trainerData: null,
                    accessToken: null,
                    refreshToken: null
                };
            }

            const { password: hashedPassword, ...TrainerDataWithoutSensitiveData } = trainerData;
            const bcryptPass = await bcrypt.compare(enteredPassword, hashedPassword);

            const verifiedTrainer = trainerData.verified
            const isBlocked = trainerData.isBlocked


            const accessToken = generateAccessToken(trainerData.trainerId)
            const refreshToken = generateRefreshToken(trainerData.trainerId)

            return {
                trainerData: TrainerDataWithoutSensitiveData,
                bcryptPass,
                accessToken,
                refreshToken,
                verifiedTrainer,
                isBlocked,
            };
        } catch (error) {
            console.error("Error verifying password: ", error);
            return {
                trainerData: null,
                bcryptPass: false
            };
        }
    }

    async googleSignUp(token: string, password: string) {
        const userInfo = await verifyGoogleToken(token);
        if (userInfo?.email_verified === true) {
            const name = userInfo.name as string
            const email = userInfo.email as string
            const existedEmail = await this._trainerRepository.findTrainerInRegister(email)
            if (existedEmail) {
                return "UserExist"
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const trainerId = v4()
                const result = await this._trainerRepository.registerThroghGoogle(trainerId, name, email, hashedPassword)
                return result
            }
        }
    }

    async googleLogin(token: string) {
        const userInfo = await verifyGoogleToken(token)
        if (userInfo?.email_verified === true) {
            const email = userInfo.email as string
            const existedEmail = await this._trainerRepository.findTrainerInRegister(email)
            console.log(existedEmail);
            if (existedEmail === null) {
                return "NotExisted"
            } else {
                const verifiedTrainer = existedEmail.verified
                const isBlocked = existedEmail.isBlocked


                const accessToken = generateAccessToken(existedEmail.trainerId)
                const refreshToken = generateRefreshToken(existedEmail.trainerId)

                return {
                    trainerData: userInfo,
                    accessToken,
                    refreshToken,
                    verifiedTrainer,
                    isBlocked,
                }
            }
        }
    }


    async editTrainerService(name: string, phone: string, address: string, gender: string, qualification: string, achivements: string, trainerId: string, feePerMonth: string, experience: string): Promise<any> {
        let editTrainerData: EditTrainerInterface = {
            name,
            phone,
            address,
            gender,
            achivements,
            qualification,
            feePerMonth,
            experience,
        }

        const existingTrainerData = await this._trainerRepository.findEditingData(trainerId)

        let check: Partial<EditTrainerInterface> = {};
        if (existingTrainerData?.name !== name) check.name = name;
        if (existingTrainerData?.phone !== phone) check.phone = phone;
        if (existingTrainerData?.address !== address) check.address = address;
        if (existingTrainerData?.gender !== gender) check.gender = gender;
        if (existingTrainerData?.qualification !== qualification) check.qualification = qualification;
        if (existingTrainerData?.achivements !== achivements) check.achivements = achivements;
        if (existingTrainerData?.feePerMonth !== feePerMonth) check.feePerMonth = feePerMonth;
        if (existingTrainerData?.experience !== experience) check.experience = experience;

        if (Object.keys(check).length === 0) {
            throw new Error("No changes detected");
        }
        const res = await this._trainerRepository.editTrainer(editTrainerData, trainerId)

        if (!res) {
            throw new Error("No changes detected");
        } else return res;
    }

    async verifyPassword(password: string, trainerId: string): Promise<boolean> {
        try {
            const trainer = await this._trainerRepository.findEditingData(trainerId);
            const storedPassword = trainer?.password;
            const bcryptPass = await bcrypt.compare(password, String(storedPassword));
            return bcryptPass;
        } catch (error) {
            console.error("Error verifying password: ", error);
            return false;
        }
    }

    async changeTrainerPass(newPassword: string, userId: string) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const res = await this._trainerRepository.changePass(hashedPassword, userId);
            if (res.modifiedCount === 0) {
                throw new Error("No changes found");
            }
            return { success: true, message: "Reset Password successfully" };
        } catch (error: any) {
            console.error("Error in reset password: ", error);
            return { success: false, message: error.message || "Internal server error" };
        }
    }

    async profileUpdate(trainerId: string, profileImage: any): Promise<ProfileUpdateResult | { success: boolean; message: string } | any> {
        try {
            const bucketName = "fitfusion-store"
            const profileKey = `trainerProfile/`;

            const uploadResult = await UpdateToAws(bucketName, profileKey, profileImage)

            const url = await getObjectURL(`trainerProfile/${uploadResult}`)

            const result = await this._trainerRepository.profileUpdate(trainerId, uploadResult);
            return { url, result };
        } catch (error: any) {
            console.error('Error in profile update: ', error);
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchCustomer(userIds: string[]) {
        try {
            const result = await this._trainerRepository.fetchCustomer(userIds)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchDeitPlans(trainerId: string) {
        try {
            const result = await this._trainerRepository.fetchDeitPlans(trainerId)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async addDietPlan(trainerId: string, dietPlan: Omit<IDietPlan, 'trainerId'>) {
        try {
            const existed = await this._trainerRepository.existedDiet(trainerId, dietPlan.dietName)
            if (!existed) {
                const result = await this._trainerRepository.AddDietPlan({ ...dietPlan, trainerId })
                return result;
            } else {
                throw new Error('A diet plan with this name already exists for this trainer');
            }
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async fetchAlreadyChatted(alreadyChatted: string[], trainerId: string) {
        try {
            const users = await this._trainerRepository.fetchAlreadyChatted(alreadyChatted, trainerId);
            return users
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async saveVideoUrl(trainerId: string, videoFile: any, thumbnail: any, title: string, description: string): Promise<any> {
        try {
            const bucketName = "fitfusion-tutorial"
            const Key = `trainer/Videos/`;
            const thumnailKey = `trainer/thumbnails/`;

            console.log(videoFile, thumbnail)
            console.log("bucketname", bucketName)
            console.log("key", Key)
            console.log("thumbnarikey", thumnailKey)

            const videoUploadResult = await UpdateToAws(bucketName, Key, videoFile)
            const videoURL = await getObjectURL(`trainers/Videos/,${videoUploadResult}`)
            const videoId = v4()

            const thumbnailUploadResult = await UpdateToAws(bucketName, thumnailKey, thumbnail)
            const thumbnailURL = await getObjectURL(`trainers/thumbnails/,${thumbnailUploadResult}`)

            const result = await this._trainerRepository.videoUpload(trainerId, videoUploadResult, thumbnailUploadResult, title, description, videoId);
            return { videoURL, thumbnailURL, result }

        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async profileFetch(trainerId: string): Promise<any> {
        try {
            let trainerData = await this._trainerRepository.profileFetch(trainerId)
            trainerData = trainerData.toObject();
            const url = await getObjectURL(`trainerProfile/${trainerData.profileIMG}`)
            trainerData = { ...trainerData, profileIMG: url }
            return trainerData
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async getVideos(trainerId: string, page: number): Promise<any> {
        try {
            let trainerVideo = await this._trainerRepository.getVideos(trainerId, page)
            const allVideos = await Promise.all(
                trainerVideo.videos.map(async (video: any) => {
                    // const videoLink = await getVideos(`trainer/Videos/${video.videoUrl}`)
                    const thumbnailLink = await getVideos(`trainer/thumbnails/${video.thumbnail}`)
                    return {
                        ...video,
                        // videoUrl: videoLink,
                        thumbnail: thumbnailLink
                    };
                })
            )
            console.log(allVideos)
            return allVideos
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async getTransaction(trainerId: string): Promise<TrainerHistory[] | any> {
        try {
            const result = await this._trainerRepository.getTransaction(trainerId)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async editVideoDetails(trainerId: string, title: string, description: string, videoId: string, videoFile: any, thumbnail: any): Promise<{ success: boolean; message: string; data?: any }> {
        try {
            const bucketName = "fitfusion-tutorial"
            const Key = `trainer/Videos/`;
            const thumnailKey = `trainer/thumbnails/`;
            console.log("Hiiiiiiiii")

            let videoUploadResult = ""
            let thumbnailUploadResult = ""
            let videoURL = ""
            let thumbnailURL = ""

            if (videoFile) {
                videoUploadResult = await UpdateToAws(bucketName, Key, videoFile)
                videoURL = await getObjectURL(`trainers/Videos/,${videoUploadResult}`)
            }

            if (thumbnail) {
                thumbnailUploadResult = await UpdateToAws(bucketName, thumnailKey, thumbnail)
                thumbnailURL = await getObjectURL(`trainers/thumbnails/,${thumbnailUploadResult}`)
            }

            const result = await this._trainerRepository.editVideoDetails(trainerId, title, description, videoId, videoUploadResult, thumbnailUploadResult);

            if (result.matchedCount === 0) {
                return { success: false, message: "No video found with the given video ID" };
            }

            return { success: true, message: "Video details updated successfully", data: { videoURL, thumbnailURL } };
        } catch (error: any) {
            console.error("Error editing video details: ", error);
            return { success: false, message: error.message || 'Internal server error' };
        }
    }


    async toggleVideoListing(trainerId: string, videoId: string, listed: string): Promise<any> {
        try {
            const result = await this._trainerRepository.toggleVideoListing(trainerId, videoId, listed);

            if (result.matchedCount === 0) {
                throw new Error("No video found with the given videoId for the specified trainerId");
            }

            if (result.modifiedCount > 0) {
                return { success: true, message: "Video edited successfully" };
            } else {
                throw new Error("No changes made to the video");
            }
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async getDashBoardData(trainerId: string, startDate: string, endDate: string): Promise<any> {
        try {
            const result = await this._trainerRepository.getDashBoardData(trainerId, startDate, endDate)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async getTotalCountOfTrainerData(trainerId: string): Promise<any> {
        try {
            const result = await this._trainerRepository.getTotalCountOfTrainerData(trainerId)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

    async getAllReview(trainerId: string): Promise<any> {
        try {
            const result = await this._trainerRepository.getAllReview(trainerId)
            return result
        } catch (error: any) {
            return { success: false, message: error.message || 'Internal server error' };
        }
    }

}