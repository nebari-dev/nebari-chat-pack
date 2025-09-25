/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '../../store';

import './header.css';


/**
 * A React component that renders the sidebar header.
 */
export
function Header(): ReactNode {
  // Fetch the `sideBarState` from the store.
  const sideBarState = useAppStore(store => store.sideBarState);

  // Fetch the `sideBarState` update function.
  const toggleSideBarState = useAppStore(store => store.toggleSideBarState);

  // Create the click handler for the toggle button.
  const handleClick = () => { toggleSideBarState() };

  // Return the rendered component with the sidebar state.
  return (
    <div className='sidebar-Header' data-state={ sideBarState }>
      <div className='sidebar-Header-logo'>
        <a className='sidebar-Header-logo-link' href='/' />
      </div>
      <button className='sidebar-Header-toggle' onClick={ handleClick } />
    </div>
  );
}
