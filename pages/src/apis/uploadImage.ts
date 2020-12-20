import requestToServer from "./requestToServer";

interface UploadTarget {
  uploadKey: string;
  url: string;
}

interface ImageProcessed {
  imageKey: string;
  desiredWidths: number[];
}

export default async function uploadImage(blob: Blob): Promise<string> {
  console.log(blob);
  const ext = "." + (blob.type.substring(blob.type.indexOf("/") + 1) ?? "png");

  const uploadTarget = await requestToServer<UploadTarget>({
    apiUrl: `/image/upload?type=${ext}`,
  });
  console.log(uploadTarget);

  const imageUploaded = await fetch(uploadTarget.url, {
    method: "PUT",
    body: blob,
  }).then((r) => r.text());
  console.log(imageUploaded);

  const processed = await requestToServer<ImageProcessed>({
    apiUrl: `/image/${uploadTarget.uploadKey}`,
    method: "POST",
  });
  console.log(processed);
  return `/image/${processed.imageKey}?w=${processed.desiredWidths[0]}`;
}
