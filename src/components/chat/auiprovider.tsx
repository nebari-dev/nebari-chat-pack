/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  AppendMessage, ThreadMessageLike
} from '@assistant-ui/react';

import {
  AssistantRuntimeProvider, useExternalStoreRuntime
} from '@assistant-ui/react';

import type {
  MutationFunctionContext, QueryFunctionContext
} from '@tanstack/react-query';

import {
  useMutation, useQuery
} from '@tanstack/react-query';

import type {
  ReactNode
} from 'react';

import {
  useCallback
} from 'react';

import {
  LoadHandler
} from './loadhandler';

import type {
  MaybeQueryKey
} from './querykey';

import {
  createQueryKey
} from './querykey';

import {
  RunHandler
} from './runhandler';


/**
 * An Assistant-UI runtime provider for a single chat session.
 */
export
function AUIProvider(props: AUIProvider.Props): ReactNode {
  // Extract the props.
  const { sessionId, agentId, setSessionId, children } = props;

  // Create the query.
  const { data, isFetching } = useQuery({
    queryKey: createQueryKey(sessionId),
    queryFn: Private.loadHistory,
    staleTime: 'static',
    placeholderData: []
  });

  // Create the mutation.
  const { isPending, mutateAsync } = useMutation({
    mutationFn: Private.runMessage
  });

  // Create the callback for running a new AUI user message.
  const onNewCallback = useCallback(async (message: AppendMessage) => {
    await mutateAsync({ message, sessionId, agentId, setSessionId });
  }, [sessionId, agentId, setSessionId]);

  // Create the runtime store adapter.
  const runtime = useExternalStoreRuntime({
    messages: data,
    isLoading: isFetching,
    isRunning: isPending,
    onNew: onNewCallback,
    convertMessage: Private.noopMessageConverter
  });

  // Return the rendered component.
  return (
    <AssistantRuntimeProvider runtime={ runtime }>
      { children }
    </AssistantRuntimeProvider>
  );
}


/**
 * The namespace for the `AUIProvider` statics.
 */
export
namespace AUIProvider {
  /**
   * The props for `AUIProvider`.
   */
  export
  type Props = {
    /**
     * The unique id of the session (thread).
     *
     * If this is `undefined` a new session will be created on the first
     * user message and `setSessionId` will be invoked.
     *
     * If this is provided, the session is assumed to exist on the server.
     */
    readonly sessionId: string | undefined;

    /**
     * The id of the agent for processing user messages.
     */
    readonly agentId: string;

    /**
     * A callback to set the id for a newly created session.
     */
    readonly setSessionId: (sessionId: string) => void;

    /**
     * The children for the provider.
     */
    readonly children?: ReactNode;
  };
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * A no-op message converter.
   *
   * This makes the AUI store adapter api happy.
   */
  export
  const noopMessageConverter = <T,>(msg: T) => msg;

  /**
   * A query function which fetches the chat history from the Agno API.
   */
  export
  async function loadHistory(
    context: QueryFunctionContext<MaybeQueryKey>
  ): Promise<readonly ThreadMessageLike[]> {
    // Extract the query key from the context.
    const { queryKey } = context;

    // Extract the session id from the query key.
    const sessionId = queryKey[1];

    // Create the handler to load the history.
    const handler = new LoadHandler(sessionId);

    // Load and return the chat history.
    return await handler.loadHistory();
  }

  /**
   * A type alias for the `runMessage` variables.
   */
  export
  type RunMessageVariables = {
    /**
     * The user message to process.
     */
    readonly message: AppendMessage;

    /**
     * The unique id of the session (thread).
     */
    readonly sessionId: string | undefined;

    /**
     * The id of the agent for processing the user messages.
     */
    readonly agentId: string;

    /**
     * A callback to set the id for a newly created session.
     */
    readonly setSessionId: (sessionId: string) => void;
  };

  /**
   * A mutation function which runs a user message on the Agno API.
   */
  export
  async function runMessage(
    variables: RunMessageVariables, context: MutationFunctionContext
  ): Promise<void> {
    // Extract the variables.
    const { message, sessionId, agentId, setSessionId } = variables;

    // Extract the query client.
    const { client } = context;

    // Create the handler to run the message.
    //
    // This will create a new session id, if needed.
    const handler = await RunHandler.create(sessionId, client);

    // Update the session id if needed.
    if (sessionId !== handler.sessionId) {
      setSessionId(handler.sessionId);
    }

    // Run the user message.
    await handler.run(message, agentId);
  }
}
