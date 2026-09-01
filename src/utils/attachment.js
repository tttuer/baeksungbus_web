export const isImageFile = (fileName = "") => /\.(jpe?g|png|gif|webp)$/i.test(fileName);

export const getAttachmentUrl = (data, fileName = "") => {
  if (!data) return "";
  if (data.startsWith?.("data:")) return data;
  const extension = fileName.split(".").pop().toLowerCase();
  const type = isImageFile(fileName) ? `image/${extension.replace("jpg", "jpeg")}` : "application/octet-stream";
  return `data:${type};base64,${data}`;
};

export const downloadAttachment = (data, fileName) => {
  const link = document.createElement("a");
  link.href = getAttachmentUrl(data, fileName);
  link.download = fileName;
  link.click();
};
