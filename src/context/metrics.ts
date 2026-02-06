/*-----------------------------------------------------------------------------
| Copyright (c) 2025-present, OpenTeams Inc.
|----------------------------------------------------------------------------*/
import {
  createContext, useContext
} from 'react';

import * as api from '@/api';


/**
 * A type alias for the metrics context value.
 */
export
type MetricsContextValue = {
  /**
   * The month for the queried metrics.
   */
  readonly month: number;

  /**
   * The year for the queried metrics.
   */
  readonly year: number;

  /**
   * Whether the current year/month is the first available.
   */
  readonly atStart: boolean;

  /**
   * Whether the current year/month is the last available.
   */
  readonly atEnd: boolean;

  /**
   * The loaded metrics for the year/month.
   */
  readonly metrics: readonly api.Metrics[];

  /**
   * A callback to update the context.
   */
  readonly update: (options: MetricsContextValue.UpdateOptions) => void;
};


/**
 * The namespace for the `MetricsContextValue` statics.
 */
export
namespace MetricsContextValue {
  /**
   * A type alias for the `update()` options.
   */
  export
  type UpdateOptions = {
    /**
     * The month for the queried metrics.
     */
    readonly month: number;

    /**
     * The year for the queried metrics.
     */
    readonly year: number;
  };
}


/**
 * The metrics context.
 */
export
const MetricsContext = createContext<MetricsContextValue | undefined>(undefined);


/**
 * A hook which returns the memories context value.
 */
export
function useMetrics(): MetricsContextValue {
  const value = useContext(MetricsContext);
  if (value === undefined) {
    throw new Error('`useMetrics` must be called within a `MetricsContext`');
  }
  return value;
}
