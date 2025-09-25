/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '../../store';

import {
  ChatList
} from './chatlist';

import {
  Header
} from './header';

import {
  HRule
} from './hrule';

import {
  NewChatButton
} from './newchatbutton';

import {
  UploadPanel
} from './uploadpanel';

import './sidebar.css';


/**
 * A React component that renders the chat sidebar.
 */
export
function SideBar(): ReactNode {
  // Extract the `sideBarState` from the store.
  const sideBarState = useAppStore(store => store.sideBarState);

  // Return the rendered component.
  return (
    <div className='sidebar-SideBar' data-state={ sideBarState }>
      <Header />
      <NewChatButton />
      <HRule title='Chats' />
      <ChatList />
      <HRule title='Files' />
      <UploadPanel />
    </div>
  );
}
