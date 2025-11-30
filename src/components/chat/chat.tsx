/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  type ReactNode
} from 'react';

import {
  Thread
} from '@/components/assistant-ui/thread';

import {
  AUIProvider
} from './auiprovider';


/**
 * A component that renders the Assistant-UI chat panel.
 */
export
function Chat(props: Chat.Props): ReactNode {
  // Extract the search params.
  const { sessionId, agentId, setSessionId } = props;

  // Return the rendered component.
  return (
    <AUIProvider
      sessionId={ sessionId }
      agentId={ agentId }
      setSessionId={ setSessionId }>
      <Thread />
    </AUIProvider>
  );
}


/**
 * The namespace for the `Chat` component statics.
 */
export
namespace Chat {
  /**
   * A type alias for the `Chat` component props.
   */
  export
  type Props = {
    /**
     * The unique id of the session (thread).
     *
     * If this is `undefined` a new session will be created on the first
     * user messages and `setSessionId` will be invoked.
     *
     * If this is provided, the session is assumed to exist on the server.
     */
    readonly sessionId: string | undefined;

    /**
     * The id of the agent for processing user messages.
     */
    readonly agentId: string;

    /**
     * A callback to set the id for a new session.
     */
    readonly setSessionId: (sessionId: string) => void;
  };
}
