import requestToServer from "./requestToServer";

interface UploadTarget {
  uploadKey: string;
  url: string;
}

interface ImageProcessed {
  imageKey: string;
  desiredWidths: number[];
}

export default async function uploadImage(file: File): Promise<string> {
  console.log(file);
  const ext = file.name.substring(file.name.lastIndexOf("."));

  const uploadTarget = await requestToServer<UploadTarget>({
    apiUrl: `/image/upload?type=${ext}`,
  });
  console.log(uploadTarget);

  const imageUploaded = await fetch(uploadTarget.url, {
    method: "PUT",
    body: file,
  }).then((r) => r.text());
  console.log(imageUploaded);

  const processed = await requestToServer<ImageProcessed>({
    apiUrl: `/image/${uploadTarget.uploadKey}`,
    method: "POST",
  });
  console.log(processed);
  return `/image/${processed.imageKey}?w=${processed.desiredWidths[0]}`;
}
