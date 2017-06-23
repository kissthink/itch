import * as React from "react";
import { createStructuredSelector } from "reselect";
import { connect, I18nProps } from "../connect";

import { IAppState } from "../../types";

import User from "../../db/models/user";

import * as actions from "../../actions";
import { dispatcher } from "../../constants/action-types";

import defaultImages from "../../constants/default-images";

import urls from "../../constants/urls";

import styled from "../styles";
import Filler from "../basics/filler";
import Button from "../basics/button";

import Dropdown from "./dropdown";
import { IDropdownItem } from "./dropdown-item";
import Icon from "../basics/icon";

const IconBadge = styled(Icon)`
  display: inline-block;
  padding: 0 4px;
`;

const UserMenuButton = styled(Button)`
  margin: 8px;
  margin-right: 0;

  .icon {
    margin: 0;
    transition: all 0.2s;
  }

  img {
    height: 32px;
    width: 32px;
    margin-right: 8px;
    border-radius: 2px;
  }
`;

class UserMenu extends React.PureComponent<
  IProps & IDerivedProps & I18nProps,
  void
> {
  items: IDropdownItem[] = [
    {
      icon: "rocket",
      label: ["sidebar.view_creator_profile"],
      onClick: () => this.props.viewCreatorProfile({}),
    },
    {
      icon: "fire",
      label: ["sidebar.view_community_profile"],
      onClick: () => this.props.viewCommunityProfile({}),
    },
    {
      type: "separator",
    },
    {
      icon: "download",
      label: ["sidebar.downloads"],
      onClick: () => this.props.navigate("downloads"),
    },
    {
      icon: "cog",
      label: ["sidebar.preferences"],
      id: "user-menu-preferences",
      onClick: () => this.props.navigate("preferences"),
    },
    {
      type: "separator",
    },
    {
      icon: "repeat",
      label: ["menu.help.check_for_update"],
      onClick: () => this.props.checkForSelfUpdate({}),
    },
    {
      icon: "search",
      label: ["menu.help.search_issue"],
      onClick: () =>
        this.props.openUrl({ url: `${urls.itchRepo}/search?type=Issues` }),
    },
    {
      icon: "bug",
      label: ["menu.help.report_issue"],
      onClick: () => this.props.reportIssue({}),
    },
    {
      icon: "lifebuoy",
      label: ["menu.help.help"],
      onClick: () => this.props.navigate("url/" + urls.manual),
    },
    {
      type: "separator",
    },
    {
      icon: "shuffle",
      label: ["menu.account.change_user"],
      id: "user-menu-change-user",
      onClick: () => this.props.changeUser({}),
    },
    {
      icon: "exit",
      label: ["menu.file.quit"],
      onClick: () => this.props.quit({}),
    },
  ];

  render() {
    return <Dropdown items={this.items} inner={this.me()} updown />;
  }

  me() {
    const { me } = this.props;
    const { coverUrl = defaultImages.avatar, username, displayName } = me;

    return (
      <UserMenuButton id="user-menu" discreet>
        <img src={coverUrl} />
        {displayName || username}
        {me.developer ? <IconBadge icon="rocket" /> : null}
        {me.pressUser ? <IconBadge icon="newspaper-o" /> : null}
        <Filler />
        <Icon icon="triangle-down" className="flipper" />
      </UserMenuButton>
    );
  }
}

interface IProps {}

interface IDerivedProps {
  me: User;
  displayName?: string;
  username: string;
  coverUrl: string;

  viewCreatorProfile: typeof actions.viewCreatorProfile;
  viewCommunityProfile: typeof actions.viewCommunityProfile;
  changeUser: typeof actions.changeUser;
  navigate: typeof actions.navigate;
  quit: typeof actions.quit;
  reportIssue: typeof actions.reportIssue;
  openUrl: typeof actions.openUrl;
  checkForSelfUpdate: typeof actions.checkForSelfUpdate;
}

export default connect<IProps>(UserMenu, {
  state: () =>
    createStructuredSelector({
      me: (state: IAppState) => state.session.credentials.me,
    }),
  dispatch: dispatch => ({
    viewCreatorProfile: dispatcher(dispatch, actions.viewCreatorProfile),
    viewCommunityProfile: dispatcher(dispatch, actions.viewCommunityProfile),
    changeUser: dispatcher(dispatch, actions.changeUser),
    navigate: dispatcher(dispatch, actions.navigate),
    quit: dispatcher(dispatch, actions.quit),
    reportIssue: dispatcher(dispatch, actions.reportIssue),
    openUrl: dispatcher(dispatch, actions.openUrl),
    checkForSelfUpdate: dispatcher(dispatch, actions.checkForSelfUpdate),
  }),
});
