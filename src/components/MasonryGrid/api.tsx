import { PhotosApiResponse } from "./../../types/apiResponse";
import { Photo } from "./../../types/photo";

export const fetchPhotos = async (
  pageToFetch: number,
  query?: string
): Promise<Photo[]> => {
  const apiKey = process.env.REACT_APP_PEXELS_API_KEY;
  const url = `https://api.pexels.com/v1/search?query=${
    query || "nature"
  }&per_page=20&page=${pageToFetch}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey || "",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: PhotosApiResponse = await response.json();
    return data.photos;
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};
