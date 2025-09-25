/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  KeyboardEvent, ReactNode, Ref
} from 'react';

import './textarea.css';


/**
 * A React component that render the text input area for a chat.
 */
export
function TextArea(props: TextArea.Props): ReactNode {
  // Extract the props.
  const { chatId, ref, onKeyDown } = props;

  // Return the rendered component.
  return (
    <div className='chat-TextArea'>
      <textarea
        className='chat-TextArea-textarea'
        ref={ ref }
        name={ `input-${chatId}` }
        placeholder='How can we help?'
        onKeyDown={ onKeyDown } />
    </div>
  );
}


/**
 * The namespace for the `TextArea` component statics.
 */
export
namespace TextArea {
  /**
   * A type alias for the `TextArea` props.
   */
  export
  type Props = {
    /**
     * The unique id of the chat.
     */
    readonly chatId: string;

    /**
     * The ref to assign to the text area element.
     */
    readonly ref: Ref<HTMLTextAreaElement>;

    /**
     * The callback to handle the text area keydown events.
     */
    readonly onKeyDown: (event: KeyboardEvent) => void;
  };
}
