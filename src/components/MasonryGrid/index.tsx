import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import styled from "styled-components";
import { Photo } from "../../types/photo";
import { PhotosApiResponse } from "../../types/apiResponse";
import { useNavigate } from "react-router-dom";
const COLUMNCOUNT = 3;
const Container = styled.div`
  display: flex;
  width: 100%;
`;

const MasonryColumn = styled.div`
  flex: 1;
  padding: 0.5rem;
`;

const ImageContainer = styled.div`
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  display: block;
  border-radius: 0.5rem;
`;

const MasonryGrid = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastIntersection = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const getPhotos = useCallback(async (pageToFetch: number) => {
    setLoading(true);

    const apiKey = process.env.REACT_APP_PEXELS_API_KEY ?? "";
    const url = `https://api.pexels.com/v1/search?query=nature&per_page=15&page=${pageToFetch}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: apiKey },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch photos. Status: ${response.status}`);
      }

      const data: PhotosApiResponse = await response.json();
      setPhotos((prevPhotos) => [...prevPhotos, ...data.photos]);
      setPage(pageToFetch + 1);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPhotos([]);
    getPhotos(1);
  }, [getPhotos]);

  useEffect(() => {
    if (loading) return;

    observer.current?.disconnect();

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const isVisible = entries[0].isIntersecting;
      if (isVisible && photos.length > 0) {
        getPhotos(page);
      }
    };

    observer.current = new IntersectionObserver(handleIntersect);

    const target = lastIntersection.current;
    if (target) {
      observer.current.observe(target);
    }
    return () => {
      observer.current?.disconnect();
    };
  }, [loading, photos, page, getPhotos]);

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

  const handleImageClick = (photoId: number) => {
    navigate(`/photo/${photoId}`);
  };
  return (
    <Container>
      {loading && <div>Loading Photos...</div>}
      {columns.map((column, columnIndex) => (
        <MasonryColumn key={columnIndex}>
          {column.map((photo: Photo, index: number) => (
            <ImageContainer
              key={photo.id}
              onClick={() => handleImageClick(photo.id)}
            >
              <Image src={photo.src.medium} loading="lazy" />
              {columnIndex === 2 && index === column.length - 1 && (
                <div ref={lastIntersection} />
              )}
            </ImageContainer>
          ))}
        </MasonryColumn>
      ))}
    </Container>
  );
};

export default MasonryGrid;
