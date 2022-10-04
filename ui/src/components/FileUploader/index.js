import React from 'react';
import { Stack, DropZone, Thumbnail, Caption } from '@shopify/polaris';

class FileUploader extends React.Component {
  handleDropZoneDrop = (file) => {
    this.props.getFileObject(file[0]);
  }

  uploadedFile = (file) => file && (
    <Stack>
      <Thumbnail
        size="small"
        alt={file.name}
        source={
          ['image/gif', 'image/jpeg', 'image/png'].indexOf(file.type) > 0
            ? window.URL.createObjectURL(file)
            : 'https://cdn.shopify.com/s/files/1/0757/9955/files/New_Post.png?12678548500147524304'
        }
      />
      <div>
        {file.name} <Caption>{file.size} bytes</Caption>
      </div>
    </Stack>
  );

  render() {
    const { file, isDisabled, actionTitle, actionHint } = this.props;

    return (
      <DropZone
        allowMultiple={false}
        onDrop={this.handleDropZoneDrop}
        disabled={isDisabled}
      >
        {this.uploadedFile(file)}
        {!file && <DropZone.FileUpload actionTitle={actionTitle} actionHint={actionHint} />}
      </DropZone>
    );
  }
}

export default FileUploader;

