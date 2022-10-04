import styled from 'styled-components';
import { Spinner } from '@shopify/polaris';
import React from 'react';

const LoadingStyle = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: ${(props) => props.minHeight};
`;

const Loading = ({minHeight}) => (
  <LoadingStyle id="loader" minHeight={minHeight}>
    <Spinner size="large" color="teal" />
  </LoadingStyle>
);

export default Loading;
