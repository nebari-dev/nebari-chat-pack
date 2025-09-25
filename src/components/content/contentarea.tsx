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
  ContentDockPanel
} from './contentdockpanel';

import {
  Onboarding
} from './onboarding';

import './contentarea.css';


/**
 * A React component which renders the chat app content area.
 */
export
function ContentArea(): ReactNode {
  // Check whether the dock layout is `null`.
  const empty = useAppStore(store => store.dockLayout === null);

  // Create the content based on whether a dock layout exists.
  const content = empty ? <Onboarding /> : <ContentDockPanel />;

  // Return the rendered content.
  return (
    <div className='content-ContentArea'>
      { content }
    </div>
  );
}
