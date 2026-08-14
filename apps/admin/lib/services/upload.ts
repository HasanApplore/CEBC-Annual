import { apiRequest } from "../api/client";

export const uploadService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const data = await apiRequest<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
    });
    return data.url;
  },
};
