import React from 'react';
import {Navbar, NavbarBrand,
  Nav,
  NavItem,
  NavLink, NavbarToggler, Collapse, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu} from 'reactstrap';

import {FaHireAHelper, FaQuestionCircle, FaUnlockAlt} from "react-icons/fa";
import * as Keycloak from "keycloak-js";
import {connect} from "react-redux";
import { loginActionDispatcher } from '../../actions/sso';
import PropTypes from 'prop-types'
import ModalExample from "./ModalExample";

import Responsive from 'react-responsive';
import ProblemTitleForm from "../problem/ProblemTitleForm";
import SolutionTitleForm from "../solution/SolutionTitleForm";
import '../../css/style.css';

import logo from "../../img/logo.svg";
import {FaLightbulb, FaRegLightbulb, FaUserCog} from "react-icons/fa/index";
import defaultavatar from "../user/default-avatar.png";

const keycloak = Keycloak('/keycloak.json');
const Desktop = props => <Responsive {...props} minWidth={992} />;
const Tablet = props => <Responsive {...props} minWidth={768} maxWidth={991} />;
const Mobile = props => <Responsive {...props} maxWidth={767} />;
const Default = props => <Responsive {...props} minWidth={768} />;
class NavbarMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {modalProblemTitle: false,
            modalSolutionTitle: false,
            isOpen: false

        };
        this.toggle = this.toggle.bind(this);

        this.toggleProblemTitle = this.toggleProblemTitle.bind(this);
        this.toggleSolutionTitle = this.toggleSolutionTitle.bind(this);
    }
    toggleProblemTitle() {
        this.setState(prevState => ({
            modalProblemTitle: !prevState.modalProblemTitle
        }));
    }
    toggleSolutionTitle() {
        this.setState(prevState => ({
            modalSolutionTitle: !prevState.modalSolutionTitle
        }));
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    componentDidMount() {

        var initOptions = {
            responseMode: 'fragment',
            flow: 'standard',
            onLoad: 'check-sso'
        };
        if(typeof this.props.loginUser.sso==="undefined" ||
            (typeof this.props.loginUser.sso!=="undefined" && !this.props.loginUser.sso.isAuthenticated)) {
            keycloak.init(initOptions).success((authenticated) => {

                    var username="";
                    if(typeof keycloak.idTokenParsed !=="undefined"){
                        username= keycloak.idTokenParsed.preferred_username;

                        var sso = {isAuthenticated: authenticated, username: username, keycloak: keycloak }
                        var loginUser = {"sso": sso};
                        this.props.loginActionDispatcher(loginUser);
                    }


            }).error(function () {
                console.log('failed to initialize');
            });
        }
    }

  handleLogin(e) {
    e.preventDefault();

    keycloak.login();

  }
  handleLogout(e) {
    e.preventDefault();

    keycloak.logout();
  }
  profilePicture(picture) {
        if(picture===null){
            picture= defaultavatar;
        }
        return picture;
    }

  profileUrl(username) {

        return "/"+ username;
    }
  navContent="";
  render() {
      const externalCloseBtnProblemTitle = <a  href="#" onClick={this.toggleProblemTitle}><FaQuestionCircle /> I need help! </a>;
      const externalCloseBtnSolutionTitle = <a href="#" onClick={this.toggleSolutionTitle}><FaRegLightbulb /> I can help! </a>;

      if((typeof this.props.loginUser.sso!=="undefined") && this.props.loginUser.sso.isAuthenticated) {

          this.navContent=(
              <Nav  className="ml-auto main-nav" navbar>
                  <NavItem>
                      {externalCloseBtnProblemTitle}
                  </NavItem>
                  <NavItem>
                      {externalCloseBtnSolutionTitle}
                  </NavItem>

                  <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                          <img className="nav-profile-img" src={this.profilePicture(this.props.loginUser.profilePhotoUrl) }  alt=""  />

                      </DropdownToggle>
                      <DropdownMenu right>
                          <DropdownItem>
                              <NavLink  href={this.profileUrl(this.props.loginUser.username) }><FaUserCog/> Profil</NavLink>
                          </DropdownItem>
                           <DropdownItem divider />
                          <DropdownItem>
                              <NavLink  href="#" onClick={this.handleLogout}><FaUnlockAlt /> Logout</NavLink>
                          </DropdownItem>
                      </DropdownMenu>
                  </UncontrolledDropdown>

              </Nav>

          );


      }else {
          this.navContent=(
              <Nav   className="ml-auto" navbar>
                  <NavItem>
                      <NavLink   href="#" onClick={this.handleLogin}><FaUnlockAlt />Login</NavLink>
                  </NavItem>

              </Nav>
          );
      }


      return (
          <div>
              <Navbar color="light" light expand="md" id="header" fixed="top" >
                  <NavbarBrand href="/" className="scrollto logo"><img src={logo}  /></NavbarBrand>
                  <NavbarToggler onClick={this.toggle} />
                  <Collapse isOpen={this.state.isOpen} navbar>
                      <Mobile>
                          <Nav  navbar>
                              <ModalExample buttonLabel="Problems"/>
                          </Nav>
                      </Mobile>
                      <Tablet>
                          <Nav  navbar>
                              <ModalExample buttonLabel="Problems"/>
                          </Nav>
                      </Tablet>
                      {this.navContent}
                  </Collapse>
              </Navbar>
              <ProblemTitleForm externalCloseBtn={externalCloseBtnProblemTitle}

                                modal={this.state.modalProblemTitle}
                                toggle={this.toggleProblemTitle} />

              <SolutionTitleForm externalCloseBtn={externalCloseBtnSolutionTitle}

                                 modal={this.state.modalSolutionTitle}
                                 toggle={this.toggleSolutionTitle} />
          </div>
      );
  }
}


NavbarMenu.propTypes = {
    loginUser: PropTypes.object.isRequired,
    loginActionDispatcher: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        loginUser: state.loginReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

        loginActionDispatcher: (user) => {
            dispatch(loginActionDispatcher(user))
        }

    };
}

    export default connect(mapStateToProps, mapDispatchToProps)(NavbarMenu);