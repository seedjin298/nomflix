import { moviesApi, tvApi } from "api";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Loader from "Components/Loader";

const Grid = styled.div`
  margin-top: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 125px);
  grid-gap: 25px;
`;

const CompanyContainer = styled("div")``;

const ImageContainer = styled("div")`
  margin-bottom: 5px;
  height: 100px;
  width: 100px;
  position: relative;
`;

const Image = styled.div`
  height: 100%;
  width: 100%;
  background-image: url(${(props) => props.bgUrl});
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 4px;
  background-position: center center;
  transition: opacity 0.1s linear;
`;

const Title = styled.span`
  display: block;
  margin-bottom: 3px;
`;

const Country = styled("span")`
  display: block;
  margin-top: 20px;
  font-size: 18px;
`;

export default function Production({
  location: { pathname },
  match: {
    params: { id },
  },
  history: { push },
}) {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const isMovie = pathname.includes("/movie/");
  async function getProduction() {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        return push("/");
      }
      let companies;
      let countries;
      if (isMovie) {
        ({
          data: { production_companies: companies },
        } = await moviesApi.movieDetail(id));
        ({
          data: { production_countries: countries },
        } = await moviesApi.movieDetail(id));
        setCompanies(companies);
        setCountries(countries);
      } else {
        ({
          data: { production_companies: companies },
        } = await tvApi.showDetail(id));
        ({
          data: { production_countries: countries },
        } = await tvApi.showDetail(id));
        setCompanies(companies);
        setCountries(countries);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getProduction();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      {companies.length > 0 ? (
        <>
          <Grid>
            {companies.map((company, index) => {
              return (
                <CompanyContainer key={`${company.id}${index}`}>
                  <ImageContainer>
                    <Image
                      bgUrl={
                        company.logo_path != null
                          ? `https://image.tmdb.org/t/p/w154${company.logo_path}`
                          : require("../assets/noPosterSmall.png")
                      }
                    />
                  </ImageContainer>
                  <Title>{company.name}</Title>
                </CompanyContainer>
              );
            })}
          </Grid>
          {countries.length > 0 && (
            <Country>
              Production Country:{" "}
              <>
                {countries.map((country, index) =>
                  index === countries.length - 1
                    ? country.name
                    : `${country.name} ??? `
                )}
              </>
            </Country>
          )}
        </>
      ) : (
        <h1>No Info Found</h1>
      )}
      <span>{error && `Error has been detected: ${error}`}</span>
    </>
  );
}
