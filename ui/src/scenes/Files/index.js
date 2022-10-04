
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import FileTable from "../../components/FileTable";
import ToastMessage from "../../components/ToastMessage";
import UploadFileModal from "../../components/UploadFileModal";

class Files extends Component {
  render() {
    const { isUploadModalOpen } = this.props;

    return (
      <div>
        <FileTable />
        {isUploadModalOpen && <UploadFileModal />}
        <ToastMessage />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isUploadModalOpen: state.files.isUploadModalOpen,
})

const connected = connect(mapStateToProps, {})(Files);

export default withRouter(connected);
