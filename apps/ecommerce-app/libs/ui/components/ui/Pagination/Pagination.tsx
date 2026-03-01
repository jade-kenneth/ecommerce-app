import { Pagination } from '@ark-ui/react';

import { createRecipeContext } from '~/utils';
import { paginationRecipe } from './Pagination.recipe';

const { withContext, withProvider } = createRecipeContext(paginationRecipe);

export const Root = withProvider(Pagination.Root, 'root');

export const PrevTrigger = withContext(Pagination.PrevTrigger, 'prevTrigger');
export const NextTrigger = withContext(Pagination.NextTrigger, 'nextTrigger');
export const Item = withContext(Pagination.Item, 'item');
export const Ellipsis = withContext(Pagination.Ellipsis, 'ellipsis');
export const Context = Pagination.Context;
