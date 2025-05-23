import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localfilepath : string) => {
    try {
        if (!localfilepath) return null

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto',
          });

        fs.unlinkSync(localfilepath)
        return response;
    } catch (error) {
        // console.log("err:", error );
        fs.unlinkSync(localfilepath) //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteOnCloudinary = async (publicId : string) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId)
        return response
    } catch (error) {
        return null
    }
}

export{
    uploadOnCloudinary,
    deleteOnCloudinary
}