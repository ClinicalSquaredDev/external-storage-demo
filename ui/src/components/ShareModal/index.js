import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Modal, Stack, RadioButton, FormLayout, Select } from '@shopify/polaris';
import styled from 'styled-components';
import { closeShareModal, shareRequest } from '../../actions/share.actions';

const ModalWrapper = styled.div`
  height: 100px;
`;

class ShareModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUser: null,
    }
  }

  handleFormSubmit = () => {
    const { share, route } = this.props;
    const { fileKey } = share;
    const { selectedUser } = this.state;
    this.props.shareRequest(fileKey, selectedUser, route)
  }

  handleChange = (user) => {
    this.setState({ selectedUser: user })
  }

  getTableRows = () => {
    const { users } = this.props;
    if (users && users.length) {
      return users.map((user, key) => ([
        <RadioButton
          label={user}
          id={key}
          value={user}
          name="user"
          onChange={() => this.handleChange(user)}
        />
      ]));
    }
    return [['No Users Found']];
  };

  closeModal = () => {
    this.setState({ selectedUser: null })
    this.props.closeShareModal();
  }

  render() {
    const { share, users, user } = this.props;
    const { isModalOpen, isLoading } = share;
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
          title={'Add Member'}
          open={isModalOpen}
          onClose={this.closeModal}
          style={{ width: '100px' }}
          primaryAction={{
            content: 'Add Member',
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
            <Stack vertical id="share-modal">
              <Stack.Item>
                <Stack vertical>
                  <form>
                    <FormLayout>
                      <FormLayout.Group>
                        <Select
                          name="users"
                          label={'Select Member'}
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
    share: state.share,
    user: state.authentication.user
  };
};

const connected = connect(mapStateToProps, { closeShareModal, shareRequest })(ShareModal);

export default withRouter(connected);

