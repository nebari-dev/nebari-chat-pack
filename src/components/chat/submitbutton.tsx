/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  MouseEvent, ReactNode
} from 'react';

import './submitbutton.css';


/**
 * A React component which renders the chat submit button.
 */
export
function SubmitButton(props: SubmitButton.Props): ReactNode {
  // Extract the props.
  const { onClick }  = props;

  // Return the rendered component.
  return (
    <button className='chat-SubmitButton' onClick={ onClick }>
      <span className='chat-SubmitButton-text'>
        Send
      </span>
      <span className='chat-SubmitButton-icon' />
    </button>
  );
}


/**
 * The namespace for the `SubmitButton` component statics.
 */
export
namespace SubmitButton {
  /**
   * A type alias for the `SubmitButton` props.
   */
  export
  type Props = {
    /**
     * The click handler for the button.
     */
    onClick: (event: MouseEvent) => void;
  };
}
