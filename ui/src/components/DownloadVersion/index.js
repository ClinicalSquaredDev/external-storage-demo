
import React, { Component } from "react";
import { Popover, Button, ActionList } from "@shopify/polaris";
import { apiUrl } from "../../constants";

class DownloadVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverActive: false
    }
  }

  downloadFile(fileKey, version) {
    window.open(`${apiUrl}/files/${fileKey}/versions/${version}`, "_parent")
  }

  togglePopoverActive = () => {
    this.setState({ popoverActive: !this.state.popoverActive })
  }

  activator = () => (
    <Button onClick={this.togglePopoverActive} disclosure>
      Download
    </Button>
  );

  render() {
    const { loopKey, versions, fileKey } = this.props;
    const actionItems = versions.map((version, key) => {
      const versionIndex = key + 1;
      return { content: `VERSION ${versionIndex}`, onAction: () => this.downloadFile(fileKey, versionIndex) }
    })

    return (
      <span key={loopKey}>
        <Popover
          active={this.state.popoverActive}
          activator={this.activator()}
          onClose={() => this.togglePopoverActive()}
        >
          <ActionList items={actionItems} />
        </Popover>
      </span>
    )
  }
}

export default DownloadVersion;
