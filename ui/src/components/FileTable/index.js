import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { Card, DataTable, Subheading, Badge } from "@shopify/polaris";
import {
  getFilesRequest,
  openUploadModal,
  setFileForUploadModal
} from "../../actions/files.actions";
import { getUsers } from "../../actions/users.actions";
import TableFooter from "../TableFooter";
import Loading from "../Loading";
import { convertTimestampToDate } from "../../utils/utils";
import { PAGINATION } from "../../constants";
import DownloadVersion from "../DownloadVersion";
import FileUploader from "../FileUploader";

const RowWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  .Polaris-Card {
    height: 100%;
  }
`;

const CardWrapper = styled.div`
  margin: 10px;
  width: ${props => props.width};
  .Polaris-Card {
    height: 100%;
  }
  .Polaris-ProgressBar {
    width: 7rem;
  }
  .Polaris-DataTable__Cell {
    vertical-align: middle;
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

const FileDropZoneWrapper = styled.div`
  float: right;
  margin: 0px 10px;
`;

class FileTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: PAGINATION.LIMIT,
      offset: PAGINATION.OFFSET
    };
  }

  handleFormSubmit = () => {
    const { description, comments } = this.state;
    this.props.uploadFileRequest(this.state.file, description, comments);
  };

  getFileObject = file => {
    this.props.setFileForUploadModal(file);
    this.props.openUploadModal();
  };

  componentDidMount() {
    const { limit, offset } = this.state;
    const { users, getFilesRequest, getUsers } = this.props;
    getFilesRequest(limit, offset);

    if (!users.length) getUsers();
  }

  mapItemToRow = (item, key) => {
    const {
      fileKey,
      fileName,
      owner,
      createdAt,
      lastActivityAt,
      fileVersions,
      numVersions
    } = item;

    return [
      <Link
        to={{
          pathname: `/files/${fileKey}`
        }}
      >
        {fileName}
      </Link>,
      <Badge size="medium">{numVersions}</Badge>,
      owner.username,
      convertTimestampToDate(createdAt),
      convertTimestampToDate(lastActivityAt),
      <DownloadVersion
        loopKey={key}
        fileKey={fileKey}
        versions={fileVersions}
      />
    ];
  };

  getTableRows = () => {
    const { files } = this.props.files;
    if (files && files.length) {
      return files.map((file, key) => this.mapItemToRow(file, key));
    }
    return [["No Records Found"]];
  };

  setOffset = offset => {
    this.setState({ offset });
    const { limit } = this.state;
    this.props.getFilesRequest(limit, offset);
  };

  render() {
    const { files, isLoading, selectedFile } = this.props.files;
    const { offset, limit } = this.state;
    const footerContent = (
      <TableFooter
        offset={offset}
        limit={limit}
        setOffset={this.setOffset}
        numberOfRows={files ? files.length : 0}
      />
    );

    const dataTable = (
      <DataTable
        columnContentTypes={["text", "text", "text", "text", "text"]}
        headings={[
          <Subheading>File Name</Subheading>,
          <Subheading># Versions</Subheading>,
          <Subheading>Owner</Subheading>,
          <Subheading>Date Created</Subheading>,
          <Subheading>Last Activity</Subheading>,
          <Subheading></Subheading>
        ]}
        rows={this.getTableRows()}
        truncate={true}
        footerContent={footerContent}
      />
    );

    return (
      <RowWrapper name="files-table">
        <Section>
          <FileDropZoneWrapper>
            <FileUploader
              getFileObject={this.getFileObject}
              file={selectedFile}
              actionTitle="Select File"
              actionHint="or drop file to upload"
            />
          </FileDropZoneWrapper>
          <Cards>
            <CardWrapper width="100%" title={"File Details"}>
              <Card sectioned style={{ width: "100%" }} title={"Files"}>
                <Card.Subsection>
                  {isLoading ? <Loading minHeight="600px" /> : dataTable}
                </Card.Subsection>
              </Card>
            </CardWrapper>
          </Cards>
        </Section>
      </RowWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    files: state.files,
    downloadUrl: state.files.downloadUrl,
    users: state.users.users
  };
};

const connected = connect(mapStateToProps, {
  getFilesRequest,
  openUploadModal,
  getUsers,
  setFileForUploadModal
})(FileTable);

export default withRouter(connected);
