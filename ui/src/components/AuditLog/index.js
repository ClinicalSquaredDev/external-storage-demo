import React, { Component } from "react";
import styled from "styled-components";
import {
  Card,
  Scrollable,
  Icon,
  DisplayText,
  TextStyle,
  Badge
} from "@shopify/polaris";
import { CircleInformationMajorMonotone } from "@shopify/polaris-icons";
import { convertTimestampToDate } from "../../utils/utils";

const CardWrapper = styled.div`
  margin: 10px;
  width: ${props => props.width};
  cursor: ${props => props.onClick && "pointer"};
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

const ListWrapper = styled.div`
  padding: 20px 0 20px 0;
`;

const CardWithIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  border-left: 4px solid slategray;
  padding: 0 0 0 40px;
  margin-left: 40px;
  .Polaris-Badge {
    float: right;
  }
`;

const IconWrapper = styled.div`
  border-radius: 50%;
  span {
    width: 2.4rem;
    height: 2.4rem;
    fill: #555;
    border-radius: 50%;
  }
  svg {
    background: white;
    border-radius: 50%;
  }
  position: absolute;
  margin-top: 72px;
  margin-left: -59px;
`;

class AuditLog extends Component {
  render() {
    const { logs } = this.props;

    return (
      <Card.Subsection>
        <Scrollable shadow style={{ height: "750px" }}>
          <ListWrapper>
            {logs &&
              logs.map((log, index) => {
                return (
                  <CardWithIcon key={index}>
                    <IconWrapper>
                      <Icon source={CircleInformationMajorMonotone} backdrop />
                    </IconWrapper>
                    <CardWrapper width="100%">
                      <Card
                        title={log.action.replace("_", " ")}
                        sectioned
                        key={index}
                      >
                        <DisplayText size="small">
                          {log.attestor && log.attestor.username}
                          {log.member && log.member.username}
                          {log.uploadedBy && log.uploadedBy.username}
                          {log.version && (
                            <TextStyle variation="subdued">
                              <Badge> Version: {log.version}</Badge>
                            </TextStyle>
                          )}
                        </DisplayText>
                        <hr />
                        <TextStyle variation="subdued">
                          {convertTimestampToDate(log.timestamp)}
                        </TextStyle>
                      </Card>
                    </CardWrapper>
                  </CardWithIcon>
                );
              })}
          </ListWrapper>
        </Scrollable>
      </Card.Subsection>
    );
  }
}

export default AuditLog;
