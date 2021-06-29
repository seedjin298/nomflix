import React from "react";
import styled from "styled-components";
import { BeatLoader } from "react-spinners";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  margin-top: 20px;
`;

const Loading = styled("span")`
  color: #91edde;
`;

export default () => (
  <Container>
    <Loading role="img" aria-label="Loading">
      Loading
    </Loading>
    <BeatLoader color={"#91EDDE"} />
  </Container>
);
