import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  Card,
  Badge,
  DataTable,
  Subheading,
  Icon,
  Button,
  Tooltip
} from "@shopify/polaris";
import FileUploader from "../FileUploader";
import {
  CircleTickMajorMonotone,
  CircleDownMajorMonotone
} from "@shopify/polaris-icons";
import {
  openUploadModal,
  setFileForUploadModal
} from "../../actions/files.actions";
import { apiUrl } from "../../constants";
import { openAttestModal } from "../../actions/attest.actions";
import styled from "styled-components";
import { convertTimestampToDate } from "../../utils/utils";

const OverflowWrapper = styled.div`
  max-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ActionWrapper = styled.div`
  .Polaris-Button {
    margin-right: 5px;
  }
`;

class VersionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
  }

  handleDownload = (fileKey, version) => {
    window.open(`${apiUrl}/files/${fileKey}/versions/${version}`, "_parent");
  };

  handleAttest = (fileKey, version) => {
    const { openAttestModal } = this.props;
    openAttestModal(fileKey, version);
  };

  getFileObject = file => {
    this.setState({ file });
    this.props.setFileForUploadModal(file);
    this.props.openUploadModal(true);
  };

  mapItemToRow = (item, members, user) => {
    const { fileKey, version, uploadedBy, timestamp, comments } = item;
    const attestors = item.attestations.map(a => a.attestor.address);
    const pendingMembers = members.filter(
      m => attestors.indexOf(m.address) < 0
    );

    return [
      <Badge
        size="medium"
        status={pendingMembers.length === 0 ? "success" : "attention"}
      >
        {item.attestations.length}
      </Badge>,
      version,
      <Tooltip>
        <OverflowWrapper
          content={convertTimestampToDate(timestamp, "YYYY/MM/DD HH:mm")}
        >
          {convertTimestampToDate(timestamp, "YYYY/MM/DD HH:mm")}
        </OverflowWrapper>
      </Tooltip>,
      <Tooltip content={uploadedBy.username}>
        <OverflowWrapper>{uploadedBy.username}</OverflowWrapper>
      </Tooltip>,
      <Tooltip content={comments}>
        <OverflowWrapper>{comments}</OverflowWrapper>
      </Tooltip>,
      <ActionWrapper>
        <Button
          outline
          size="slim"
          onClick={() => this.handleDownload(fileKey, version)}
          title="Download"
        >
          <Icon title="Download" source={CircleDownMajorMonotone} />
        </Button>
        {!item.attestations.find(
          a => a.attestor && a.attestor.address === user.account
        ) ? (
          <Button
            outline
            size="slim"
            onClick={() => this.handleAttest(fileKey, version)}
            title="Verify"
          >
            <Icon title="Verify" source={CircleTickMajorMonotone} />
          </Button>
        ) : (
          ""
        )}
      </ActionWrapper>
    ];
  };

  getTableRows = (versions, members, user) => {
    if (versions.length) {
      return versions.map(version => this.mapItemToRow(version, members, user));
    }
    return [["No Versions Found"]];
  };

  render() {
    const { fileMeta, isUploadVersionLoading, authentication } = this.props;
    const { versions, members } = fileMeta;
    const { user } = authentication;

    return (
      <Card sectioned title={"Versions"}>
        <Card.Subsection>
          <FileUploader
            getFileObject={this.getFileObject}
            file={this.state.file}
            actionTitle="Add New Version"
            actionHint="or drop file to add version"
            isDisabled={isUploadVersionLoading}
          />

          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "text",
              "text",
              "text",
              "text"
            ]}
            headings={[
              <Subheading>
                <Icon source={CircleTickMajorMonotone} />
              </Subheading>,
              <Subheading>Version</Subheading>,
              <Subheading>Uploaded At</Subheading>,
              <Subheading>Uploaded By</Subheading>,
              <Subheading>Comments</Subheading>,
              <Subheading></Subheading>
            ]}
            rows={this.getTableRows(versions, members, user)}
            truncate={true}
          />
        </Card.Subsection>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    isUploadVersionLoading: state.files.isUploadVersionLoading,
    authentication: state.authentication
  };
};

const connected = connect(mapStateToProps, {
  openUploadModal,
  setFileForUploadModal,
  openAttestModal
})(VersionDetails);

export default withRouter(connected);
