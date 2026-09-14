"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";

const CLOUDINARY_HOSTNAME = "res.cloudinary.com";
const CLOUDINARY_UPLOAD_MARKER = "/image/upload/";
const STORED_AUTO_TRANSFORMATION = /^f_auto,q_auto\//;

function isCloudinaryUrl(src: ImageProps["src"]): src is string {
  if (typeof src !== "string") return false;

  try {
    return new URL(src).hostname === CLOUDINARY_HOSTNAME;
  } catch {
    return false;
  }
}

export function cloudinaryImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const markerIndex = src.indexOf(CLOUDINARY_UPLOAD_MARKER);
  if (markerIndex === -1) return src;

  const assetStart = markerIndex + CLOUDINARY_UPLOAD_MARKER.length;
  const prefix = src.slice(0, assetStart);
  const assetPath = src
    .slice(assetStart)
    .replace(STORED_AUTO_TRANSFORMATION, "");
  const transformation = [
    "f_auto",
    `q_${quality ?? "auto"}`,
    "c_limit",
    `w_${width}`,
  ].join(",");

  return `${prefix}${transformation}/${assetPath}`;
}

/**
 * Uses Cloudinary for responsive transformations when the source is a
 * Cloudinary delivery URL. Other sources retain Next.js' default optimizer.
 */
export function CloudinaryImage({
  src,
  alt,
  ...props
}: Omit<ImageProps, "loader">) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      loader={isCloudinaryUrl(src) ? cloudinaryImageLoader : undefined}
    />
  );
}
