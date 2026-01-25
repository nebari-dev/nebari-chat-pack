/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  type ReactNode
} from 'react';

import {
  useCallback
} from 'react';

import {
  Button
} from '@/components/ui/button';

import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';

import {
  cn
} from '@/lib/utils';


/**
 * A react component that renders the Fault Injector card.
 */
export
function FaultInjector(props: FaultInjector.Props): ReactNode {
  // Extract the props.
  const { className } = props;

  // Create the handler to inject a latency fault.
  const injectLatencyFault = useCallback(() => {
    console.log('inject latency fault');
  }, []);

  // Create the handler to inject a packet fault.
  const injectPacketFault = useCallback(() => {
    console.log('inject packet fault');
  }, []);

  // Create the handler to inject a clock fault.
  const injectClockFault = useCallback(() => {
    console.log('inject clock fault');
  }, []);

  // Return the rendered component.
  return (
    <Card className={ cn(
      'min-w-0 min-h-40 gap-2 py-4 rounded-sm', className) }>
      <CardHeader className='px-4'>
        <CardTitle>
          Fault Injector
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4 grow min-h-0f flex flex-col gap-2'>
        <Button
          variant='destructive'
          className='cursor-pointer bg-red-400'
          onClick={ injectLatencyFault }>
          Latency Spike
        </Button>
        <Button
          variant='destructive'
          className='cursor-pointer bg-red-400'
          onClick={ injectPacketFault }>
          Packet Loss
        </Button>
        <Button
          variant='destructive'
          className='cursor-pointer bg-red-400'
          onClick={ injectClockFault }>
          Clock Skew
        </Button>
      </CardContent>
    </Card>
  );
}


/**
 * The namespace for the `FaultInjector` statics.
 */
export
namespace FaultInjector {
  /**
   * A type alias for the `FaultInjector` props.
   */
  export
  type Props = {
    /**
     * The class name for the component.
     */
    readonly className?: string;
  };
}
