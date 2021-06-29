import { tvApi } from "api";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "Components/Loader";

const Grid = styled.div`
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 125px);
  grid-gap: 25px;
`;

const SeasonContainer = styled("div")``;

const ImageContainer = styled.div`
  margin-bottom: 5px;
  position: relative;
`;

const Image = styled.div`
  background-image: url(${(props) => props.bgUrl});
  height: 180px;
  background-size: cover;
  border-radius: 4px;
  background-position: center center;
  transition: opacity 0.1s linear;
`;

const Title = styled.span`
  display: block;
  margin-bottom: 3px;
`;

const Year = styled.span`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
`;

export default function Season({
  location: { pathname },
  match: {
    params: { id },
  },
  history: { push },
}) {
  const [loading, setLoading] = useState(true);
  const [seasons, setSeasons] = useState([]);
  const [error, setError] = useState(null);
  async function getSeason() {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return push("/");
      }
      const {
        data: { seasons },
      } = await tvApi.showDetail(parsedId);
      setSeasons(seasons);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getSeason();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      {seasons.length > 0 ? (
        <>
          <Grid>
            {seasons.map((season, index) => {
              return (
                <SeasonContainer key={`${season.id}${index}`}>
                  <ImageContainer>
                    <Image
                      bgUrl={
                        season.poster_path
                          ? `https://image.tmdb.org/t/p/w300${season.poster_path}`
                          : require("../assets/noPosterSmall.png")
                      }
                    />
                  </ImageContainer>
                  <Title>{season.name}</Title>
                  <Year>
                    {season.air_date && season.air_date.substring(0, 4)}
                  </Year>
                </SeasonContainer>
              );
            })}
          </Grid>
        </>
      ) : (
        <h1>No Other Seasons Found</h1>
      )}
    </>
  );
}
