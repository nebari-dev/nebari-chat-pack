/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useCallback, useMemo
} from 'react';

import {
  DockPanel
} from 'otui/containers';

import type {
  PanelSpec
} from '../../store';

import {
  useAppStore
} from '../../store';

import {
  ChatPanelMemo, ChatTabMemo
} from '../chat';

import './contentdockpanel.css';


/**
 * A React component which renders the content dock panel.
 *
 * #### Notes
 * This component assumes that a non-null `DockLayout` exists in the store.
 *
 * This is a valid assumption since the parent `ContentArea` component handles
 * the `null` dock layout case by rendering some default landing content.
 */
export
function ContentDockPanel(): ReactNode {
  // Fetch the panel specs from the store.
  const panelSpecs = useAppStore(store => store.panelSpecs);

  // Fetch the dock layout from the store, which is assumed to exist.
  const dockLayout = useAppStore(store => store.dockLayout)!;

  // Fetch the dock layout setter from the store.
  const setDockLayout = useAppStore(store => store.setDockLayout);

  // Create the map of dock items from the store panels.
  const itemMap = useMemo(() => {
    return Private.createItemMap(panelSpecs);
  }, [panelSpecs]);

  // Create the callback to handle dock panel events.
  const handleDockEvent = useCallback((event: DockPanel.DockPanelEvent) => {
    if (event.type === 'layout-change-requested') {
      setDockLayout(event.layout);
    }
  }, [setDockLayout]);

  // Return the rendered component.
  return (
    <DockPanel
      className='content-ContentDockPanel'
      items={ itemMap }
      layout={ dockLayout }
      eventHandler={ handleDockEvent }
      splitPanelClassName='content-ContentDockPanel-SplitPanel'
      tabPanelClassName='content-ContentDockPanel-TabPanel'
      tabPanelPanelClassName='content-ContentDockPanel-TabPanel-Panel'
      tabBarInnerClassName='content-ContentDockPanel-TabBar-inner'
      tabClassName='content-ContentDockPanel-Tab'
      overlayClassName='content-ContentDockPanel-Overlay'
      handleSize={ 8 } />
  );
}


/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * A function which creates a dock panel `ItemMap`.
   */
  export
  function createItemMap(specs: readonly PanelSpec[]): DockPanel.ItemMap {
    // Setup the empty item map.
    const items: Record<string, DockPanel.Item> = {};

    // Loop over the panel specs to create the items.
    for (const spec of specs) {
      // TODO skip non-chat panel specs for now.
      if (spec.type !== 'chat-panel') {
        continue;
      }

      // Create the dock panel item for the chat.
      const item: DockPanel.Item = {
        tabContent: <ChatTabMemo chatId={ spec.id } />,
        content: <ChatPanelMemo chatId={ spec.id } />
      };

      // Add the dock item to the map.
      items[spec.id] = item;
    }

    // Return the items map.
    return items;
  }
}
