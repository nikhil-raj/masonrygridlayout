import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Photo } from "../../types/photo";
import { fetchPhotos } from "./api";
import Search from "../Search";
const COLUMNCOUNT = 3;

const Container = styled.div`
  padding: 0 2rem;
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;
const PhotosContainer = styled.div`
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
  const [searchparam, setSearchParam] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const lastIntersection = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const getPhotos = useCallback(async (pageToFetch: number, query?: string) => {
    setLoading(true);
    const newPhotos = await fetchPhotos(pageToFetch, query);
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    setPage(pageToFetch + 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    setPhotos([]);
    getPhotos(1, searchparam);
  }, [getPhotos, searchparam]);

  useEffect(() => {
    if (loading) return;

    observer.current?.disconnect();

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const isVisible = entries[0].isIntersecting;
      if (isVisible && photos.length > 0) {
        getPhotos(page, searchparam);
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
  }, [loading, photos, page, getPhotos, searchparam]);

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
      <Search onClick={setSearchParam} />
      <PhotosContainer>
        {columns.map((column, columnIndex) => (
          <MasonryColumn key={columnIndex}>
            {column.map((photo: Photo, index: number) => (
              <ImageContainer
                key={photo.id}
                onClick={() => handleImageClick(photo.id)}
              >
                <Image src={photo.src.medium} loading="lazy" alt={photo.alt} />
                {columnIndex === 2 && index === column.length - 1 && (
                  <div ref={lastIntersection} />
                )}
              </ImageContainer>
            ))}
          </MasonryColumn>
        ))}
      </PhotosContainer>
      {loading && <div>Loading Photos...</div>}
    </Container>
  );
};

export default MasonryGrid;
