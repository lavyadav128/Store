import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

// This reads CLOUDINARY_URL automatically
cloudinary.config(true);

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:        `notenova/${req.body.category}`,
    resource_type: "auto",
    public_id:     `${Date.now()}-${file.originalname}`,
  }),
});

export const upload = multer({ storage });
export { cloudinary };