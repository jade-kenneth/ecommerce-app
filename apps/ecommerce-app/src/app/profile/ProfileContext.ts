import { createContext } from '@ark-ui/react/utils';

import { useProfile } from './useProfile';

export const [ProfileProvider, useProfileContext] = createContext<ReturnType<typeof useProfile>>();
