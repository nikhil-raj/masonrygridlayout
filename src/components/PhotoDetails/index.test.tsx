import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import PhotoDetail from ".";
import {
  BrowserRouter as Router,
  useParams,
  useNavigate,
} from "react-router-dom";
import { Photo } from "../../types/photo";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

global.fetch = jest.fn();

describe("PhotoDetail", () => {
  const mockPhoto: Photo = {
    id: 1,
    width: 800,
    height: 600,
    url: "https://abc.com/photo1",
    photographer: "Test Photographer",
    photographer_url: "https://abc.com/photographer",
    photographer_id: 123,
    avg_color: "#ffffff",
    src: {
      original: "https://abc.com/photo1/original",
      large2x: "https://abc.com/photo1/large2x",
      large: "https://abc.com/photo1/large",
      medium: "https://abc.com/photo1/medium",
      small: "https://abc.com/photo1/small",
      portrait: "https://abc.com/photo1/portrait",
      landscape: "https://abc.com/photo1/landscape",
      tiny: "https://abc.com/photo1/tiny",
    },
    liked: false,
    alt: "Test Photo 1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    (useParams as jest.Mock).mockReturnValue({ photoId: "1" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    render(
      <Router>
        <PhotoDetail />
      </Router>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders photo details after fetching", async () => {
    (useParams as jest.Mock).mockReturnValue({ photoId: "1" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPhoto),
    });

    await act(async () => {
      render(
        <Router>
          <PhotoDetail />
        </Router>
      );
    });

    await waitFor(() => {
      expect(screen.getByAltText("Test Photo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Photo 1")).toBeInTheDocument();
      expect(
        screen.getByText("Photographer: Test Photographer")
      ).toBeInTheDocument();
      expect(
        screen.getByText("https://abc.com/photographer")
      ).toBeInTheDocument();
    });
  });

  it("navigates back to home on back button click", async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    (useParams as jest.Mock).mockReturnValue({ photoId: "1" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPhoto),
    });

    await act(async () => {
      render(
        <Router>
          <PhotoDetail />
        </Router>
      );
    });

    await waitFor(() => {
      const backButton = screen.getByRole("button", { name: "X" });
      act(() => {
        backButton.click();
      });
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });
});
