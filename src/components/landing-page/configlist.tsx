/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  Link
} from "@tanstack/react-router";

import {
  Button
} from "@/components/ui/button";

import type {
  ReactNode
} from 'react';

import {
  Card
} from '@/components/ui/card'

import * as api from '@/api';


/**
 * A React component that renders the homepage dropdown items.
 */
export
function ConfigList(props: DropdownArea.Props): ReactNode {
  // Extract the props.
  const {content, type} = props;

  // Return the rendered component.
  return (
    <div
      className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full'}
    >
      {content.map((item) => (
        <ConfigListItem
          name={item.name}
          chatLink={`/chat?type=${type}&id=${item.id}`}
          configLink={`config?type=${type}&id=${item.id}`}
        />
      ))}
    </div>
  );
}


/**
 * The namespace for the `DropdownArea` component.
 */
export
namespace DropdownArea {
  /**
   * A type alias for the `DropdownArea` props.
   */
  export
  type Props = {
    /**
     * Information for each dropdown item
     */
    readonly content: api.AgentDetail[];

    /**
     * Type of agent configs (Agents | Teams | Workflows)
     */
    readonly type: string;
  };
}


/**
 * A React component that renders a launcher link.
 */
function ConfigListItem(props: ConfigListItem.Props): ReactNode {
  // Extract the props.
  const {name, chatLink, configLink} = props;

  // Return the rendered component.
  return (
    <Card className='flex-row justify-between px-5'>
      <div className='my-auto font-semibold'>{name}</div>
      <div className='flex gap-2'>
        <Link to={chatLink}>
          <Button>
            Chat
          </Button>
        </Link>

        <Link to={configLink}>
          <Button variant='outline'>
            Config
          </Button>
        </Link>
      </div>
    </Card>
  );
}


/**
 * The namespace for the `DropdownItem` component.
 */
namespace ConfigListItem {
  /**
   * A type alias for the `DropdownItem` props.
   */
  export
  type Props = {
    /**
     * The agnet name.
     */
    readonly name: string | null | undefined;

    /**
     * Url to the chat with selected agent.
     */
    readonly chatLink: string;

    /**
     * Config page for each selected agent.
     */
    readonly configLink: string;
  };
}
