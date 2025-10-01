/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  clsx
} from 'clsx';

import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '@/store';

import {
  Header
} from './header';

import {
  Launcher
} from './launcher';

import {
  RecentChats
} from './recentchats';


/**
 * A React component that renders the chat sidebar.
 */
export
function SideBar(): ReactNode {
  // Extract the `sideBarState` from the store.
  const sidebarState = useAppStore(store => store.sidebarState);

  // Determine whether the sidebar is open.
  const open = sidebarState === 'open';

  // Return the rendered component.
  return (
    <div className={ clsx(
      'flex flex-col flex-none gap-3 border-r border-bd-neutral-default',
      'bg-bg-white transition-[width] duration-150',
      open ? 'w-72' : 'w-12.25'
    ) }>
      <Header />
      <Launcher />
      <RecentChats />
    </div>
  );
}
