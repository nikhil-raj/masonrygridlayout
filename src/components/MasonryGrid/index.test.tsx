import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import MasonryGrid from ".";
import * as api from "./api";
import { Photo } from "../../types/photo";
import { BrowserRouter as Router } from "react-router-dom";
jest.mock("./api");

global.IntersectionObserver = class IntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  root = null;
  rootMargin = "";
  thresholds = [];
  takeRecords = jest.fn();
};

const mockPhotos: Photo[] = [
  {
    id: 1,
    width: 800,
    height: 600,
    url: "https://example.com/photo1",
    photographer: "Test Photographer",
    photographer_url: "https://example.com/photographer",
    photographer_id: 123,
    avg_color: "#ffffff",
    src: {
      original: "https://example.com/photo1/original",
      large2x: "https://example.com/photo1/large2x",
      large: "https://example.com/photo1/large",
      medium: "https://example.com/photo1/medium",
      small: "https://example.com/photo1/small",
      portrait: "https://example.com/photo1/portrait",
      landscape: "https://example.com/photo1/landscape",
      tiny: "https://example.com/photo1/tiny",
    },
    liked: false,
    alt: "Test Photo 1",
  },
  {
    id: 2,
    width: 800,
    height: 600,
    url: "https://example.com/photo2",
    photographer: "Test Photographer 2",
    photographer_url: "https://example.com/photographer2",
    photographer_id: 124,
    avg_color: "#000000",
    src: {
      original: "https://example.com/photo2/original",
      large2x: "https://example.com/photo2/large2x",
      large: "https://example.com/photo2/large",
      medium: "https://example.com/photo2/medium",
      small: "https://example.com/photo2/small",
      portrait: "https://example.com/photo2/portrait",
      landscape: "https://example.com/photo2/landscape",
      tiny: "https://example.com/photo2/tiny",
    },
    liked: false,
    alt: "Test Photo 2",
  },
];

describe("MasonryGrid", () => {
  beforeEach(() => {
    (api.fetchPhotos as jest.Mock).mockResolvedValue(mockPhotos);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    render(
      <Router>
        <MasonryGrid />
      </Router>
    );

    expect(screen.getByText("Loading Photos...")).toBeInTheDocument();
  });

  it("renders photos after fetching", async () => {
    await act(async () => {
      render(
        <Router>
          <MasonryGrid />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByAltText("Test Photo 1")).toBeInTheDocument();
      expect(screen.getByAltText("Test Photo 2")).toBeInTheDocument();
    });
  });
});
