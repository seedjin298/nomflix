import React from "react";
import PropTypes from "prop-types";
import { Route, Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import Helmet from "react-helmet";
import Loader from "Components/Loader";
import Video from "Routes/Video";
import Production from "Routes/Production";
import Season from "Routes/Season";

const Container = styled.div`
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  padding: 50px;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  filter: blur(3px);
  opacity: 0.5;
  z-index: 0;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;
  height: 100%;
`;

const Cover = styled.div`
  width: 30%;
  background-image: url(${(props) => props.bgImage});
  background-position: center center;
  background-size: cover;
  height: 100%;
  border-radius: 5px;
`;

const Data = styled.div`
  width: 70%;
  margin-left: 10px;
`;

const Title = styled.h3`
  font-size: 32px;
`;

const ItemContainer = styled.div`
  margin: 20px 0;
`;

const Item = styled.span``;

const Divider = styled.span`
  margin: 0 10px;
`;

const Overview = styled.p`
  font-size: 12px;
  opacity: 0.7;
  line-height: 1.5;
  width: 50%;
`;

const InsideMenu = styled("div")`
  margin: 20px 0px;
`;

const List = styled("ul")`
  display: flex;
`;

const Tab = styled("li")`
  margin-right: 20px;
  font-size: 18px;
  padding: 10px;
  border-bottom: 3px solid
    ${(props) => (props.active ? "#3498db" : "transparent")};
  transition: border-bottom 0.5s ease-in-out;
`;

const DetailPresenter = withRouter(
  ({ location: { pathname }, result, loading, error, isMovie }) =>
    loading ? (
      <>
        <Helmet>
          <title>Loading | Nomflix</title>
        </Helmet>
        <Loader />
      </>
    ) : (
      <Container>
        <Helmet>
          <title>
            {result.original_title
              ? result.original_title
              : result.original_name}{" "}
            | Nomflix
          </title>
        </Helmet>
        <Backdrop
          bgImage={`https://image.tmdb.org/t/p/original${result.backdrop_path}`}
        />
        <Content>
          <Cover
            bgImage={
              result.poster_path
                ? `https://image.tmdb.org/t/p/original${result.poster_path}`
                : require("../../assets/noPosterSmall.png")
            }
          />
          <Data>
            <Title>
              {result.original_title
                ? result.original_title
                : result.original_name}
            </Title>
            <ItemContainer>
              <Item>
                {result.release_date
                  ? result.release_date.substring(0, 4)
                  : result.first_air_date.substring(0, 4)}
              </Item>
              <Divider>•</Divider>
              <Item>
                {result.runtime ? result.runtime : result.episode_run_time[0]}{" "}
                min
              </Item>
              <Divider>•</Divider>
              <Item>
                {result.genres &&
                  result.genres.map((genre, index) =>
                    index === result.genres.length - 1
                      ? genre.name
                      : `${genre.name} / `
                  )}
              </Item>
              {result.imdb_id && (
                <>
                  <Divider>•</Divider>
                  <Item>
                    <a href={`https://www.imdb.com/title/${result.imdb_id}`}>
                      IMDB
                    </a>
                  </Item>
                </>
              )}
            </ItemContainer>
            <Overview>{result.overview}</Overview>
            <InsideMenu>
              <List>
                {isMovie ? (
                  <>
                    <Tab active={pathname === `/movie/${result.id}/video`}>
                      <Link to={`/movie/${result.id}/video`}>Video</Link>
                    </Tab>
                    <Tab active={pathname === `/movie/${result.id}/production`}>
                      <Link to={`/movie/${result.id}/production`}>
                        Production
                      </Link>
                    </Tab>
                  </>
                ) : (
                  <>
                    <Tab active={pathname === `/show/${result.id}/season`}>
                      <Link to={`/show/${result.id}/season`}>Season</Link>
                    </Tab>
                    <Tab active={pathname === `/show/${result.id}/video`}>
                      <Link to={`/show/${result.id}/video`}>Video</Link>
                    </Tab>
                    <Tab active={pathname === `/show/${result.id}/production`}>
                      <Link to={`/show/${result.id}/production`}>
                        Production
                      </Link>
                    </Tab>
                  </>
                )}
              </List>
            </InsideMenu>

            {isMovie ? (
              <>
                <Route path={`/movie/:id/video`} component={Video} />
                <Route path={`/movie/:id/production`} component={Production} />
              </>
            ) : (
              <>
                <Route path={`/show/:id/video`} component={Video} />
                <Route path={`/show/:id/season`} component={Season} />
                <Route path={`/show/:id/production`} component={Production} />
              </>
            )}
          </Data>
        </Content>
      </Container>
    )
);

DetailPresenter.propTypes = {
  result: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isMovie: PropTypes.bool.isRequired,
};

export default DetailPresenter;
