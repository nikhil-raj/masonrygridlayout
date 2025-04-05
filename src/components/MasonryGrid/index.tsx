import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import { Photo } from "../../types/photo";
import { PhotosApiResponse } from "../../types/apiResponse";
const COLUMNCOUNT = 3;
const Container = styled.div`
  display: flex;
  width: 100%;
`;

const MasonryColumn = styled.div`
  flex: 1;
  padding: 8px;
`;

const ImageContainer = styled.div`
  margin-bottom: 8px;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  display: block;
  border-radius: 8px;
`;

const MasonryGrid = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const getPhotos = useCallback(async () => {
    setLoading(true);

    const apiKey = process.env.REACT_APP_PEXELS_API_KEY ?? "";
    const url = `https://api.pexels.com/v1/search?query=nature&per_page=30&page=1`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: apiKey },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch photos. Status: ${response.status}`);
      }

      const data: PhotosApiResponse = await response.json();
      setPhotos((prevPhotos) => [...prevPhotos, ...data.photos]);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPhotos([]);
    getPhotos();
  }, [getPhotos]);

  const columns = useMemo(() => {
    const columnsArray: Photo[][] = Array(COLUMNCOUNT)
      .fill(null)
      .map(() => []);

    photos.forEach((photo, index) => {
      const columnIndex = index % COLUMNCOUNT;
      columnsArray[columnIndex].push(photo);
    });

    return columnsArray;
  }, [photos]);

  return (
    <Container>
      {loading && <div>Loading Photos...</div>}
      {columns.map((column, columnIndex) => (
        <MasonryColumn key={columnIndex}>
          {column.map((photo) => (
            <ImageContainer key={photo.id}>
              <Image src={photo.src.medium} loading="lazy" />
            </ImageContainer>
          ))}
        </MasonryColumn>
      ))}
    </Container>
  );
};

export default MasonryGrid;
