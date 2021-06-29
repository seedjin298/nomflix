import { moviesApi, tvApi } from "api";
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";
import Loader from "Components/Loader";

const ButtonContainer = styled("div")`
  display: flex;
  margin-top: 20px;
`;

const VideoButton = styled("span")`
  cursor: pointer;
  font-size: 18px;
`;

const CurrentVideo = styled("span")`
  font-size: 18px;
  margin: 0px 15px;
`;

export default function Video({
  location: { pathname },
  match: {
    params: { id },
  },
  history: { push },
}) {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(null);
  const isMovie = pathname.includes("/movie/");
  const length = videos.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  async function getVideo() {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return push("/");
      }
      let videos;
      if (isMovie) {
        ({
          data: { results: videos },
        } = await moviesApi.movieVideo(parsedId));
        setVideos(videos);
      } else {
        ({
          data: { results: videos },
        } = await tvApi.showVideo(parsedId));
        setVideos(videos);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getVideo();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      {length > 0 ? (
        <>
          {videos.map((video, index) => {
            return (
              <>
                {index === current && (
                  <ReactPlayer
                    key={index}
                    url={`https://www.youtube.com/watch?v=${video.key}`}
                    height="60%"
                    width="60%"
                    controls
                  />
                )}
              </>
            );
          })}
          <ButtonContainer>
            <VideoButton onClick={prevSlide}>Prev</VideoButton>
            <CurrentVideo>
              {current + 1} / {length}
            </CurrentVideo>
            <VideoButton onClick={nextSlide}>Next</VideoButton>
          </ButtonContainer>
        </>
      ) : (
        <h1>No Video Found</h1>
      )}
      <span>{error && `Error has been detected: ${error}`}</span>
    </>
  );
}
