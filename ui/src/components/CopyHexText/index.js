import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardMinor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';
import styled from "styled-components";
import { setUserMessage } from '../../actions/userMessage.actions';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const CopyText = styled.div`
  margin: 10px 0px 10px 0px;
  font-size: medium;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  width: 250px;
  cursor: pointer;
  .Polaris-Icon {
    display: inline-block;
    margin: -4px 6px;
  }
`;

const CopyHexText = props => {
  return (
  <div>
    <CopyToClipboard {...props} onCopy={() => {props.setUserMessage('copied', true)}} >
      <CopyText><Icon source={ClipboardMinor} />{props.text}</CopyText>
    </CopyToClipboard>
  </div>
)};

const mapStateToProps = () => {
  return {};
};

const connected = connect(mapStateToProps, { setUserMessage })(CopyHexText);

export default withRouter(connected);