const dataUrlPattern = /^data:([^;]+);base64,(.*)$/;

export default function base64ImageToBlob(dataUrl: string): Blob {
  const match = dataUrl.match(dataUrlPattern);
  if (!match) {
    throw new Error(`Invalid dataUrl[${dataUrl}]`);
  }

  const [, contentType, base64] = match;
  const sliceSize = 512;
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
