import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  Card,
  Icon,
  ResourceList,
  ResourceItem,
  Stack,
  Button,
  Badge,
  Select,
  TextStyle
} from "@shopify/polaris";
import { MobileBackArrowMajorMonotone } from "@shopify/polaris-icons";
import { getFileMetaRequest } from "../../actions/files.actions";
import ShareModal from "../../components/ShareModal";
import AttestFileModal from "../../components/AttestFileModal";
import TransferOwnerModal from "../../components/TransferOwnerModal";
import { getUsers } from "../../actions/users.actions";
import ToastMessage from "../../components/ToastMessage";
import Loading from "../../components/Loading";
import { convertTimestampToDate } from "../../utils/utils";
import AuditLog from "../../components/AuditLog";
import { removeRequest, openShareModal } from "../../actions/share.actions";
import QRCode from "qrcode.react";
import CopyHexText from "../../components/CopyHexText";
import VersionDetails from "../../components/VersionDetails";
import { openTransferOwnerModal } from "../../actions/transferOwner.actions";
import UploadFileModal from "../../components/UploadFileModal";

const RowWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  .Polaris-Card {
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CardWrapper = styled.div`
  margin: 10px;
  width: ${props => props.width};
  cursor: ${props => props.onClick && "pointer"};
  #filter-audit-log {
    color: #212b36;
    text-decoration: none;
  }
`;

const FileActionsWrapper = styled.div`
  width: 100%;
  .Polaris-Button {
    float: right;
    margin: 0px 10px;
  }
`;

const BackButton = styled.div`
  margin: 10px 20px;
  font-weight: 700;
  float: left;
`;

const ColumnsWrapper = styled.div`
  margin: 10px 10px 10px 0px;
`;

const DetailLabel = styled.div`
  color: gray;
  font-weight: 500;
  font-size: medium;
  padding: 0px 0px 4px 0px;
`;

const DetailValue = styled.div`
  font-size: medium;
  padding: 0px 0px 4px 0px;
`;

const FileDetailsWrapper = styled.div`
  .Polaris-Stack__Item {
    width: 30%;
  }
`;

const QRWrapper = styled.div`
  text-align: center;
  .Polaris-Select {
    width: 150px;
    display: inline-block;
    margin: 0px 0px 15px 0px;
  }
`;

const MultiColumn = styled.div`
  margin: 20px 0px;
  .Polaris-ButtonGroup {
    display: inline-block;
  }
  #add-member {
    text-decoration: none;
  }
  #add-member-card {
    width: 250px;
  }
`;

const ActionContainer = styled.div`
  width: 100%;
  .Polaris-Badge {
    float: right;
  }
  button {
    float: right;
  }
`;

class FileDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedVersion: 1,
      selectedEvent: "ALL EVENTS"
    };
  }

  componentDidMount() {
    const { getFileMetaRequest, getUsers, match, users } = this.props;
    getFileMetaRequest(match.params.id);

    if (!users.length) getUsers();
  }

  handleMember = fileKey => {
    this.props.openShareModal(fileKey);
  };

  handleVersionSelection = value => {
    this.setState({
      selectedVersion: value
    });
  };

  render() {
    const {
      files,
      isShareModalOpen,
      isAttestModalOpen,
      istransferOwnerModalOpen,
      authentication,
      openTransferOwnerModal
    } = this.props;
    const { fileMeta, isFileMetaLoading, isUploadModalOpen } = files;
    const { id } = this.props.match.params;
    const { user } = authentication;

    const members = fileMeta && fileMeta.members.length ? fileMeta.members : [];

    const fileDetails = (
      <FileDetailsWrapper>
        <Stack distribution="equalSpacing">
          <>
            <ColumnsWrapper>
              <DetailLabel>File Name</DetailLabel>
              <DetailValue>{fileMeta && fileMeta.fileName}</DetailValue>
            </ColumnsWrapper>
            <ColumnsWrapper>
              <DetailLabel>Description</DetailLabel>
              <DetailValue>{fileMeta && fileMeta.fileDescription}</DetailValue>
            </ColumnsWrapper>
          </>
          <>
            <ColumnsWrapper>
              <DetailLabel>Owner</DetailLabel>
              <DetailValue>{fileMeta && fileMeta.owner.username}</DetailValue>
            </ColumnsWrapper>
            <ColumnsWrapper>
              <DetailLabel>Date Created</DetailLabel>
              <DetailValue>
                {fileMeta && convertTimestampToDate(fileMeta.createdAt)}
              </DetailValue>
            </ColumnsWrapper>
            <ColumnsWrapper>
              <DetailLabel>Last Activity</DetailLabel>
              <DetailValue>
                {fileMeta && convertTimestampToDate(fileMeta.lastActivityAt)}
              </DetailValue>
            </ColumnsWrapper>
          </>
          <>
            <QRWrapper>
              {fileMeta && fileMeta.versions && (
                <div>
                  <Select
                    options={fileMeta.versions.map((v, k) => {
                      return {
                        label: `VERSION ${v.version}`,
                        value: v.version
                      };
                    })}
                    onChange={this.handleVersionSelection}
                    value={this.state.selectedVersion}
                  />
                  <QRCode
                    value={
                      fileMeta.versions.find(
                        v => v.version === parseInt(this.state.selectedVersion)
                      ).fileHash
                    }
                  />
                  <CopyHexText
                    text={
                      fileMeta.versions.find(
                        v => v.version === parseInt(this.state.selectedVersion)
                      ).fileHash
                    }
                  />
                </div>
              )}
            </QRWrapper>
          </>
        </Stack>
      </FileDetailsWrapper>
    );

    return (
      <RowWrapper name="files-table">
        <Section>
          <div>
            <BackButton>
              <Link
                to={{
                  pathname: `/files`
                }}
              >
                <Icon source={MobileBackArrowMajorMonotone} />
              </Link>
            </BackButton>
            <FileActionsWrapper>
              {fileMeta && fileMeta.owner.address === user.account && (
                <Button onClick={() => openTransferOwnerModal(id)}>
                  Transfer Ownership
                </Button>
              )}
            </FileActionsWrapper>
          </div>
          <Cards>
            <CardWrapper width="70%">
              <Card sectioned title={"File Details"}>
                {isFileMetaLoading && <Loading minHeight="240px" />}
                {!isFileMetaLoading && fileDetails}
              </Card>
              <MultiColumn>
                <Stack>
                  <Stack.Item>
                    <Card
                      sectioned
                      id="add-member-card"
                      title={"Members"}
                      actions={[
                        {
                          content: (
                            <Button outline size="slim">
                              Add Member
                            </Button>
                          ),
                          onClick: () => this.handleMember(id),
                          id: "add-member"
                        }
                      ]}
                    >
                      {isFileMetaLoading && <Loading minHeight="240px" />}
                      {!isFileMetaLoading && (
                        <div>
                          <ResourceList
                            items={members}
                            renderItem={member => {
                              return (
                                <ResourceItem id={member.address}>
                                  <Stack distribution="fillEvenly">
                                    <TextStyle>{member.username}</TextStyle>
                                    <ActionContainer>
                                      {fileMeta.owner.address ===
                                        member.address && <Badge>Owner</Badge>}
                                      {fileMeta.owner.address ===
                                        user.account &&
                                        member.address !== user.account && (
                                          <Button
                                            outline
                                            size="slim"
                                            onClick={() => {
                                              this.props.removeRequest(
                                                id,
                                                member.address,
                                                this.props.route
                                              );
                                            }}
                                          >
                                            Remove
                                          </Button>
                                        )}
                                    </ActionContainer>
                                  </Stack>
                                </ResourceItem>
                              );
                            }}
                          />
                        </div>
                      )}
                    </Card>
                  </Stack.Item>
                  <Stack.Item fill>
                    {isFileMetaLoading && (
                      <Card sectioned title={"Versions"}>
                        <Loading minHeight="240px" />
                      </Card>
                    )}
                    {!isFileMetaLoading && fileMeta && (
                      <VersionDetails
                        fileMeta={fileMeta}
                        isFileMetaLoading={isFileMetaLoading}
                      />
                    )}
                  </Stack.Item>
                </Stack>
              </MultiColumn>
            </CardWrapper>
            <CardWrapper width="30%">
              <Card
                sectioned
                style={{ width: "100%" }}
                title={"Audit Log"}
                actions={
                  fileMeta
                    ? [
                        {
                          content: (
                            <div><Select
                              id="event-filter"
                              options={fileMeta.auditLog.reduce(
                                (o, a) => {
                                  if (o.indexOf(a.action.replace("_", " ")) < 0)
                                    o.push(a.action.replace("_", " "));
                                  return o;
                                },
                                ["ALL EVENTS"]
                              )}
                              value={this.state.selectedEvent}
                              onChange={event =>
                                this.setState({ selectedEvent: event })
                              }
                            /></div>
                          ),
                          id: "filter-audit-log"
                        }
                      ]
                    : []
                }
              >
                {isFileMetaLoading && <Loading minHeight="240px" />}
                {!isFileMetaLoading && fileMeta && (
                  <AuditLog
                    logs={
                      this.state.selectedEvent === "ALL EVENTS"
                        ? fileMeta.auditLog
                        : fileMeta.auditLog.filter(
                            l =>
                              l.action.replace("_", " ") ===
                              this.state.selectedEvent
                          )
                    }
                  />
                )}
              </Card>
            </CardWrapper>
          </Cards>
        </Section>
        {istransferOwnerModalOpen && <TransferOwnerModal />}
        {isShareModalOpen && <ShareModal />}
        {isAttestModalOpen && <AttestFileModal />}
        {isUploadModalOpen && <UploadFileModal />}
        <ToastMessage />
      </RowWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    files: state.files,
    isShareModalOpen: state.share.isModalOpen,
    isAttestModalOpen: state.attest.isAttestModalOpen,
    istransferOwnerModalOpen: state.transferOwner.isModalOpen,
    users: state.users.users,
    authentication: state.authentication
  };
};

const connected = connect(mapStateToProps, {
  getFileMetaRequest,
  getUsers,
  removeRequest,
  openTransferOwnerModal,
  openShareModal
})(FileDetails);

export default withRouter(connected);
