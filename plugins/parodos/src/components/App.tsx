import React from 'react';
import { useInterval } from '@patternfly/react-core';
import { Progress } from '@backstage/core-components';

import { useStore } from '../stores/workflowStore/workflowStore';
import { useInitializeStore } from '../hooks/useInitializeStore';
import { PluginRouter } from './PluginRouter';

const POLLING_INTERVAL_MILLISECONDS = 5 * 1000;

export const App = () => {
  const fetchProjects = useStore(state => state.fetchProjects);
  const initiallyLoaded = useStore(state => state.initiallyLoaded);
  useInitializeStore();

  useInterval(() => {
    // Assumption: the fetchProjects does not take longer then POLLING_INTERVAL
    // If needed, we can i.e. leverage state.loading to skip certain ticks
    fetchProjects(fetch);
  }, POLLING_INTERVAL_MILLISECONDS);

  return initiallyLoaded ? <PluginRouter /> : <Progress />;
};
