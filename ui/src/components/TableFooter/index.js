import { Button, Icon } from '@shopify/polaris';
import React from 'react';
import styled from 'styled-components';

import { ArrowLeftMinor, ArrowRightMinor } from '@shopify/polaris-icons';
import PropTypes from 'prop-types';

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const FooterText = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`;

const ArrowButton = styled.div`
  margin-left: 5px;
`;

const TableFooter = ({ offset, limit, setOffset, numberOfRows }) => {
  const onNextClick = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
  };

  const onPrevClick = () => {
    const newOffset = Math.max(0, offset - limit);
    setOffset(newOffset);
  };

  const from = offset + 1;
  const to = offset + Math.min(numberOfRows, limit);

  return (
    <FooterWrapper>
      <FooterText>{`Rows ${from}-${to}`}</FooterText>
      <ArrowButton>
        <Button plain disabled={!(offset > 0)} onClick={onPrevClick}>
          <Icon source={ArrowLeftMinor} />
        </Button>
      </ArrowButton>
      <ArrowButton>
        <Button plain disabled={numberOfRows < limit} onClick={onNextClick}>
          <Icon source={ArrowRightMinor} />
        </Button>
      </ArrowButton>
    </FooterWrapper>
  );
};

TableFooter.propTypes = {
  limit: PropTypes.number,
  offset: PropTypes.number,
  setOffset: PropTypes.func,
  numberOfRows: PropTypes.number
};

export default TableFooter;
