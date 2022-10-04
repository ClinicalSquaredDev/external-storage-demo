import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Modal, Stack, TextField, FormLayout } from "@shopify/polaris";
import styled from "styled-components";
import {
  closeUploadModal,
  uploadFileRequest,
  uploadFileVersionRequest
} from "../../actions/files.actions";

const ModalWrapper = styled.div`
  height: 100px;
`;

const FieldWrapper = styled.div`
  margin-top: 10px;
`;

class UploadFileModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileDescription: "",
      comments: ""
    };
  }

  handleFormSubmit = () => {
    const { selectedFile, isVersionUpload } = this.props.files;
    const { fileDescription, comments } = this.state;
    const { match } = this.props;
    if (isVersionUpload) {
      this.props.uploadFileVersionRequest(
        match.params.id,
        selectedFile,
        comments
      );
    } else {
      this.props.uploadFileRequest(selectedFile, fileDescription, comments);
    }
  };

  setFileDescription = fileDescription => {
    this.setState({ fileDescription });
  };

  setComment = comments => {
    this.setState({ comments });
  };

  render() {
    const {
      isUploadModalOpen,
      isFileUploading,
      selectedFile,
      isVersionUpload,
      isUploadVersionLoading
    } = this.props.files;

    return (
      <ModalWrapper>
        <Modal
          title={isVersionUpload ? "Upload New Version" : "Upload File"}
          open={isUploadModalOpen}
          onClose={this.props.closeUploadModal}
          style={{ width: "100px" }}
          primaryAction={{
            id: "upload-file",
            content: "Upload",
            disabled: !selectedFile || isFileUploading,
            loading: isFileUploading || isUploadVersionLoading,
            onAction: this.handleFormSubmit
          }}
          secondaryActions={[
            {
              content: "Cancel",
              disabled: isFileUploading || isUploadVersionLoading,
              onAction: () => this.props.closeUploadModal()
            }
          ]}
        >
          <Modal.Section>
            <Stack vertical id="upload-file-modal">
              <Stack.Item>
                <FormLayout>
                  <FormLayout.Group>
                    {!isVersionUpload && (
                      <FieldWrapper>
                        <TextField
                          name="fileDescription"
                          label="Description"
                          onChange={text => this.setFileDescription(text)}
                          type="text"
                          value={this.state.fileDescription}
                        />
                      </FieldWrapper>
                    )}
                    <FieldWrapper>
                      <TextField
                        name="comments"
                        label="Comments"
                        onChange={text => this.setComment(text)}
                        type="text"
                        value={this.state.comments}
                      />
                    </FieldWrapper>
                  </FormLayout.Group>
                </FormLayout>
              </Stack.Item>
            </Stack>
          </Modal.Section>
        </Modal>
      </ModalWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    files: state.files
  };
};

const connected = connect(mapStateToProps, {
  closeUploadModal,
  uploadFileRequest,
  uploadFileVersionRequest
})(UploadFileModal);

export default withRouter(connected);
