import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getUser, logout } from "../../actions/authentication.actions";
import { AppProvider, Frame, TopBar } from '@shopify/polaris'
import Loading from '../Loading';
import styled from 'styled-components';
import '@shopify/polaris/styles.css';

const UserMenu = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 100%;
  padding: 0 15px 0 15px;
  justify-content: space-between;
  color: #000000;
`;

const TopBarWrapper = styled.div`
  border-bottom: 1px;
`;

const VersionText = styled.div`
  margin-left: 5px;
  text-align: right;
  width: 100%;
  padding: 18px 10px;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 500px;
`;

const LogoText = styled.div`
  font-size: large;
  margin-left: 5px;
  font-weight: bold;
`;

const UserNameWrapper = styled.div`
  font-weight: bold;
`;

const theme = {
  colors: {
    topBar: {
      background: '#FFFFFF',
      userMenu: {
        color: 'black'
      }
    }
  }
};

const logo = (
  <LogoWrapper>
    <LogoText>STRATO Document Management</LogoText>
  </LogoWrapper>
);

class EnsureAuthenticated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserMenuOpen: false,
    }
  };

  setUserMenuOpen = () => {
    this.setState({ isUserMenuOpen: !this.state.isUserMenuOpen })
  };

  componentDidMount() {
    this.props.getUser();
  }

  render() {
    const { authentication, children, logout } = this.props;
    const { isUserMenuOpen } = this.state;

    const userMenu = (
      <UserMenu id="user-menu">
        {logo}
        <VersionText></VersionText>
        <TopBar.UserMenu
          actions={[
            {
              items: [
                {
                  id: 'LOGOUT',
                  content: 'Logout',
                  onAction: logout
                }
              ]
            }
          ]}
          open={isUserMenuOpen}
          onToggle={() => this.setUserMenuOpen()}
          name={<UserNameWrapper>{authentication.user && authentication.user.username}</UserNameWrapper>}
        />
      </UserMenu>
    );

    const topBarMarkup = (
      <TopBarWrapper>
        <TopBar showNavigationToggle userMenu={userMenu} />
      </TopBarWrapper>
    );

    const {
      isAuthenticated,
      isGetUserComplete,
      loginUrl,
      logoutUrl
    } = authentication;

    if (logoutUrl) {
      window.location = logoutUrl;
      return null;
    }

    if (!isGetUserComplete) {
      return (
        <AppProvider>
          <Frame>
            <Loading minHeight="100vh"/>
          </Frame>
        </AppProvider>
      );
    }

    if (isGetUserComplete && !isAuthenticated) {
      window.location = loginUrl;
      return null;
    }

    return (
      <AppProvider theme={theme}>
        <Frame topBar={topBarMarkup}>
          {children}
        </Frame>
      </AppProvider>
    );
  }
}

function mapStateToProp(state) {
  return {
    authentication: state.authentication
  };
}

export default withRouter(
  connect(
    mapStateToProp,
    {
      getUser,
      logout
    }
  )(EnsureAuthenticated)
);
