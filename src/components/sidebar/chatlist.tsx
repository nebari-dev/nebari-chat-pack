/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useShallow
} from 'zustand/react/shallow';

import {
  useAppStore,
} from '../../store';

import {
  Topic
} from './topic';

import './chatlist.css';


/**
 * A React component which renders the chat list in the side bar.
 */
export
function ChatList(): ReactNode {
  // Fetch the chat ids from the store.
  const chatIds = useAppStore(useShallow(store =>
    store.chats.map(chat => chat.id)
  ));

  // Extract the `sideBarState` from the store.
  const sideBarState = useAppStore(store => store.sideBarState);

  // Create the topic components for the chat list.
  const topics = chatIds.map(chatId =>
    <Topic key={ chatId } chatId={ chatId } />
  );

  // Return the rendered component.
  return (
    <div className='sidebar-ChatList' data-state={ sideBarState }>
      <ul className='sidebar-ChatList-list'>
        { topics }
      </ul>
    </div>
  );
}
