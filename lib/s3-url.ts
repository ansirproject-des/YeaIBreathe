export function getS3Url(key: string) {
  if (key.startsWith("http") || key.startsWith("blob:")) {
    return key;
  }

  const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;

  if (!bucket || !region) {
    throw new Error("Missing AWS public environment variables.");
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}