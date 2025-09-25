/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '../../store';

import './newchatbutton.css';


/**
 * A React component that renders a "New Chat" button.
 *
 * The button delegates to the app store for creating new chats.
 */
export
function NewChatButton(): ReactNode {
  // Fetch the `sideBarState` from the store.
  const sideBarState = useAppStore(store => store.sideBarState);

  // Fetch the `createChat` function from the store.
  const createChat = useAppStore(store => store.createChat);

  // Create the click handler for the button.
  const onClick = () => { createChat() };

  // Return the rendered button.
  return (
    <button
      className='sidebar-NewChatButton'
      data-state={ sideBarState }
      onClick={ onClick }>
      <span className='sidebar-NewChatButton-icon' />
      <span className='sidebar-NewChatButton-text'>
        New Chat
      </span>
    </button>
  );
}
