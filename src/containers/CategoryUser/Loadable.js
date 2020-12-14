/**
 * Asynchronously loads the component for HomePage
 */

import React from 'react';
import loadable from '@Helpers/loadable';
import LoadingIndicator from '../../components/LoadingIndicator';

export default loadable(() => import('./index'), {
  fallback: <LoadingIndicator />,
});
