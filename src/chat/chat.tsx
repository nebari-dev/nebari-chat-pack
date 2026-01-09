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

import {
  Header
} from './header';

/**
 * A component that renders the Assistant-UI chat panel.
 */
export
function Chat(): ReactNode {
  return (
    <main className='grow flex flex-col'>
      <Header />
      <div className='grow min-h-0'>
        <AUIProvider>
          <Thread />
        </AUIProvider>
      </div>
    </main>
  );
}
