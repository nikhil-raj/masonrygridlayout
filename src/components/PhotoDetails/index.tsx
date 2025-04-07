import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Photo } from "../../types/photo";

const PhotoDetailContainer = styled.div`
  display: flex;
  padding: 0.5rem;
  justify-content: center;
  overflow-y: auto;
  @media (max-width: 768px) {
    flex-direction: column;
    overflow-y: scroll;
    height: auto;
  }
`;

const Image = styled.img`
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
`;

const BackButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;

  color: #555555;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const BackButtonContainer = styled.div`
  text-align: center;
  width: 5%;
  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    margin: 0 0 1rem 0;
  }
`;

const ImageContainer = styled.div`
  width: 80%;
  flex-direction: column;
  display: flex;
  padding: 2rem 0;

  text-align: center;
  border-radius: 15px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0.1rem 0.5rem rgba(0, 0, 0, 0.08);
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PhotoDetail: React.FC = () => {
  const { photoId } = useParams<{ photoId: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhoto = async () => {
      const apiKey = process.env.REACT_APP_PEXELS_API_KEY;
      const url = `https://api.pexels.com/v1/photos/${photoId}`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization:
              "plS57qPHcGoq12Las98OadeAYN3DUTZlQTHi7IaJk1pZ6glyhJh4bEes",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Photo = await response.json();
        setPhoto(data);
      } catch (error) {
        console.error("Error fetching photo details:", error);
      }
    };

    if (photoId) {
      fetchPhoto();
    }
  }, [photoId]);

  if (!photo) {
    return <div>Loading...</div>;
  }

  return (
    <PhotoDetailContainer>
      <BackButtonContainer>
        <BackButton onClick={() => navigate("/")}>X</BackButton>
      </BackButtonContainer>
      <ImageContainer>
        <Image src={photo.src.large2x} alt={photo.alt} />

        <h3>{photo.alt}</h3>
        <p>Photographer: {photo.photographer}</p>
        <p>
          <a href={photo.photographer_url} target="_blank" rel="noreferrer">
            {photo.photographer_url}
          </a>
        </p>
      </ImageContainer>
    </PhotoDetailContainer>
  );
};

export default PhotoDetail;
