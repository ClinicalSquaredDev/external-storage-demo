import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Modal, Stack } from '@shopify/polaris';
import styled from 'styled-components';
import FileUploader from '../FileUploader';
import { attestRequest, closeAttestModal } from '../../actions/attest.actions';

const ModalWrapper = styled.div`
  height: 100px;
`;

class AttestFileModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null
    }
  }

  handleFormSubmit = () => {
    const { attest } = this.props;
    const { fileKey, selectedVersion } = attest;
    const { file } = this.state;

    this.props.attestRequest(fileKey, selectedVersion, file);
  }

  getFileObject = (file) => {
    this.setState({ file })
  }

  render() {
    const { isAttestModalOpen, isAttestLoading } = this.props.attest;
    const { file } = this.state;

    return (
      <ModalWrapper>
        <Modal
          title={'Verify File'}
          open={isAttestModalOpen}
          onClose={this.props.closeAttestModal}
          style={{ width: '100px' }}
          primaryAction={{
            id: 'attest-file',
            content: 'Verify',
            disabled: !this.state.file || isAttestLoading,
            loading: isAttestLoading,
            onAction: this.handleFormSubmit
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              disabled: isAttestLoading,
              onAction: () => this.props.closeAttestModal()
            }
          ]}
        >
          <Modal.Section>
            <Stack vertical id="attest-modal">
              <Stack.Item>
                <Stack vertical>
                  <FileUploader
                    getFileObject={this.getFileObject}
                    file={file}
                    isDisabled={isAttestLoading}
                    actionTitle="Verify File"
                    actionHint="or drop file to verify"
                  />
                </Stack>
              </Stack.Item>
            </Stack>
          </Modal.Section>
        </Modal>
      </ModalWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    attest: state.attest
  };
};

const connected = connect(mapStateToProps, { closeAttestModal, attestRequest })(AttestFileModal);

export default withRouter(connected);

