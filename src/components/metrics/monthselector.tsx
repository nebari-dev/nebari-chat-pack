/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  ChevronLeft, ChevronRight
} from 'lucide-react';

import type {
  ComponentProps, ReactNode
} from 'react';

import {
  cn
} from '@/lib/utils';

import {
  useMetricsConfig
} from './metricsconfigprovider';


/**
 * A React component that renders the month selector for the metrics page.
 */
export
function MonthSelector(): ReactNode {
  // Fetch the metrics config.
  const { year, month, update } = useMetricsConfig();

  // Get todays date.
  const today = new Date();

  // Get the date for the beginning of the current month.
  const currentMonth = new Date(today.getFullYear(), today.getMonth());

  // Get the date for the beginning of the selected month.
  //
  // Note: `Date` objects use 0-based month indexing, the `MetricsConfig`
  // uses 1-based month indexing.
  const selectedMonth = new Date(year, month - 1);

  // Create the callback to navigate to the previous month.
  const handlePrev = () => {
    update({
      year: month === 1 ? year - 1 : year,
      month: month === 1 ? 12 : month - 1
    });
  };

  // Create the callback to navigate to the next month.
  const handleNext = () => {
    update({
      year: month === 12 ? year + 1 : year,
      month: month === 12 ? 1 : month + 1
    });
  };

  // Format the label for the selected month.
  const label = Private.monthFormatter.format(selectedMonth);

  // Determine whether the next button should be disabled.
  const nextDisabled = selectedMonth >= currentMonth;

  // Return the rendered component.
  return (
    <div className='flex items-center gap-2'>
      <Private.Button onClick={ handlePrev }>
        <ChevronLeft />
      </Private.Button>
      <span className='min-w-24 text-center text-sm font-medium'>
        { label }
      </span>
      <Private.Button disabled={ nextDisabled } onClick={ handleNext }>
        <ChevronRight />
      </Private.Button>
    </div>
  );
}


/**
 * The namespace for module implementation details.
 */
namespace Private {
  /**
   * A predefined month formatter for the `MonthSelector`.
   *
   * This is more efficient than using `Date.toLocaleString`.
   */
  export
  const monthFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    year: 'numeric'
  });

  /**
   * A React component that renders a `MonthSelector` button.
   */
  export
  function Button(props: ComponentProps<'button'>): ReactNode {
    // Extract the props.
    const { className, ...rest } = props;

    // Calculate the full class name for the button.
    const fcn = cn(
      'rounded border px-2 py-1 text-sm cursor-pointer',
      'disabled:opacity-40 disabled:cursor-default',
      className
    );

    // Return the rendered component.
    return <button className={ fcn } { ...rest } />;
  }
}
