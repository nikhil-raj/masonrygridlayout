import { Photo } from "./photo";
export interface PhotosApiResponse {
  page: number;
  per_page: number;
  photos: Photo[];
  total_results: number;
  next_page: string;
}
