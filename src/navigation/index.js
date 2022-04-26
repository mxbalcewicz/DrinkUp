import React from 'react';

import { AuthenticatedUserProvider } from '../navigation/AuthenticatedUserProvider';
import RootNavigator from '../navigation/RootNavigator';

/**
 * Wrap all providers here
 */

export default function Routes() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}