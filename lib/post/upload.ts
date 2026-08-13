import axios from "axios";

export async function uploadFile(file: File) {
  const { data } = await axios.post("/api/upload-url", {
    fileName: file.name,
    fileType: file.type,
  });

  const { uploadUrl, key } = data;

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return key;
}