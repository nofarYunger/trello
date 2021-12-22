import axios from "axios";

export const cloudinaryService = {
  uploadImg,
};

async function uploadImg(file) {
  const CLOUD_NAME = "nofar";
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/nofar/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "yn9mpntb");
  try {
    const res = await axios(UPLOAD_URL, {
      method: "POST",
      data: formData,
    });
    const data = res.data;
    return data;
  } catch (err) {
    console.log(err);
  }
}
