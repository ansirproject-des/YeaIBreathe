import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const allowedAudioTypes = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
];

const allowedDocumentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json();

    const extension = fileName.split(".").pop();

    let folder: "media" | "audio" | "files";

    if (
      allowedImageTypes.includes(fileType) ||
      allowedVideoTypes.includes(fileType)
    ) {
      folder = "media";
    } else if (allowedAudioTypes.includes(fileType)) {
      folder = "audio";
    } else if (allowedDocumentTypes.includes(fileType)) {
      folder = "files";
    } else {
      return NextResponse.json(
        { error: "Unsupported file type." },
        { status: 400 }
      );
    }

    const key = `posts/${folder}/${crypto.randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60,
    });

    return NextResponse.json({
      uploadUrl,
      key,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
}