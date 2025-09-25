/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import type {
  ReactNode
} from 'react';

import {
  useAppStore
} from '../../store';

import './hrule.css';


/**
 * A react component which renders a horizontal rule with a centered title.
 */
export
function HRule(props: HRule.Props): ReactNode {
  // Extract the props.
  const { title } = props;

  // Fetch the `sideBarState` from the store.
  const sideBarState = useAppStore(store => store.sideBarState);

  // Return the rendered component.
  return (
    <div className='sidebar-HRule' data-state={ sideBarState }>
      <hr className='sidebar-HRule-hr' />
      <span className='sidebar-HRule-title'>
        { title }
      </span>
      <hr className='sidebar-HRule-hr' />
    </div>
  );
}


/**
 * The namespace for the `HRule` component statics.
 */
namespace HRule {
  /**
   * A type alias for the `HRule` props.
   */
  export
  type Props = {
    /**
     * The title to center in the `HRule`.
     */
    readonly title: string;
  };
}
