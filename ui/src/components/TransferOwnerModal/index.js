import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Modal, Stack, FormLayout, Select } from '@shopify/polaris';
import styled from 'styled-components';
import { closeTransferOwnerModal, transferOwnerRequest } from '../../actions/transferOwner.actions';

const ModalWrapper = styled.div`
  height: 100px;
`;

class TransferOwnerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: '',
    }
  }

  handleFormSubmit = () => {
    const { route, transferOwner } = this.props;
    const { fileKey } = transferOwner;
    const { selectedUser } = this.state;
    this.props.transferOwnerRequest(fileKey, selectedUser, route)
  }

  handleChange = (user) => {
    this.setState({ selectedUser: user })
  }

  closeModal = () => {
    this.setState({ selectedUser: null })
    this.props.closeTransferOwnerModal();
  }

  render() {
    const { transferOwner, users, user } = this.props;
    const { isModalOpen, isLoading } = transferOwner;

    const userList = [{ label: '', value: '' }];

    if (users) {
      users.forEach((row) => {
        if (!(row.account === user.account))
          userList.push({ label: row.username, value: row.account });
      });
    }

    return (
      <ModalWrapper>
        <Modal
          title={'Transfer Owner'}
          open={isModalOpen}
          onClose={this.closeModal}
          style={{ width: '100px' }}
          primaryAction={{
            id: 'transfer-owner',
            content: 'Update Owner',
            disabled: !this.state.selectedUser || isLoading,
            loading: isLoading,
            onAction: this.handleFormSubmit
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              disabled: isLoading,
              onAction: () => this.closeModal()
            }
          ]}
        >
          <Modal.Section>
            <Stack vertical id="transfer-owner-modal">
              <Stack.Item>
                <Stack vertical>
                  <form>
                    <FormLayout>
                      <FormLayout.Group>
                        <Select
                          name="users"
                          label={'Select User'}
                          options={userList}
                          value={this.state.selectedUser}
                          onChange={(user) => this.handleChange(user)}
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </form>
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
    users: state.users.users,
    transferOwner: state.transferOwner,
    user: state.authentication.user
  };
};

const connected = connect(mapStateToProps, { closeTransferOwnerModal, transferOwnerRequest })(TransferOwnerModal);

export default withRouter(connected);

