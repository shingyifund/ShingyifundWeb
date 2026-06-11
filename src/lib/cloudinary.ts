import { createHash } from "crypto";

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  bytes?: number;
  width?: number;
  height?: number;
};

type CloudinaryDestroyResult = {
  result?: string;
  error?: { message?: string };
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function sign(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function uploadCloudinaryImage({
  file,
  folder,
  publicId,
}: {
  file: File;
  folder: string;
  publicId: string;
}) {
  const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = requiredEnv("CLOUDINARY_API_KEY");
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET");
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, public_id: publicId, timestamp };
  const signature = sign(params, apiSecret);
  const formData = new FormData();
  const bytes = await file.arrayBuffer();

  formData.set("file", new Blob([bytes], { type: file.type }), file.name);
  formData.set("api_key", apiKey);
  formData.set("timestamp", String(timestamp));
  formData.set("folder", folder);
  formData.set("public_id", publicId);
  formData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  const json = (await response.json()) as CloudinaryUploadResult & {
    error?: { message?: string };
  };

  if (!response.ok || json.error) {
    throw new Error(json.error?.message ?? "Cloudinary upload failed");
  }

  return {
    publicId: json.public_id,
    imageUrl: json.secure_url,
    fileSize: json.bytes ?? file.size,
    width: json.width ?? null,
    height: json.height ?? null,
  };
}

export async function deleteCloudinaryImage(publicId: string) {
  if (!publicId) return;

  const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = requiredEnv("CLOUDINARY_API_KEY");
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET");
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const signature = sign(params, apiSecret);
  const formData = new FormData();

  formData.set("public_id", publicId);
  formData.set("api_key", apiKey);
  formData.set("timestamp", String(timestamp));
  formData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: "POST", body: formData },
  );
  const json = (await response.json()) as CloudinaryDestroyResult;

  if (!response.ok || json.error) {
    throw new Error(json.error?.message ?? "Cloudinary delete failed");
  }
}
