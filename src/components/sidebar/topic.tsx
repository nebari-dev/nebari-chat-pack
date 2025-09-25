/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '../../store';

import './topic.css';


/**
 * A react component which renders a chat topic in the side bar.
 *
 * #### Notes
 * This component assumes that `chatId` exists in the store.
 */
export
function Topic(props: Topic.Props): ReactNode {
  // Extract the props.
  const { chatId } = props;

  // Fetch the chat name from the store.
  const name = useAppStore(store => {
    // Find the chat in the store.
    const chat = store.chats.find(chat => chat.id === chatId)!;

    // Return the chat display name.
    return chat.display_name;
  });

  // Fetch the `openChat` function from the store.
  const openPanel = useAppStore(store => store.openPanel);

  // Fetch the `deleteChat` functino from the store.
  const deleteChat = useAppStore(store => store.deleteChat);

  // Create the event handler to open an existing chat.
  const handleOpen = () => { openPanel(chatId); };

  // Create the event handler to delete an existing chat.
  const handleDelete = () => { deleteChat(chatId); };

  // Return the rendered component.
  return (
    <li className='sidebar-Topic'>
      <span className='sidebar-Topic-name' onClick={ handleOpen }>
        { name }
      </span>
      <span className='sidebar-Topic-options' onClick={ handleDelete } />
    </li>
  );
}


/**
 * The namespace for the `Topic` component statics.
 */
export
namespace Topic {
  /**
   * A type alias for the `Topic` props.
   */
  export
  type Props = {
    /**
     * The chat id for the topic.
     */
    readonly chatId: string;
  }
}
