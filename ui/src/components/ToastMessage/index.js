
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Toast } from "@shopify/polaris";
import { resetUserMessage } from "../../actions/userMessage.actions";

class ToastMessage extends Component {
  render() {
    const { userMessage, resetUserMessage } = this.props;

    return (
      userMessage.message ?
        <Toast
          content={userMessage.message}
          onDismiss={resetUserMessage}
          error={!userMessage.success}
        />
        : null)
  }
}

const mapStateToProps = (state) => {
  return {
    userMessage: state.userMessage,
  };
};

const connected = connect(mapStateToProps, {
  resetUserMessage
})(ToastMessage);

export default withRouter(connected);
