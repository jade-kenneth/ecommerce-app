import { Assign } from '@ark-ui/react';
import * as React from 'react';
import { VariantProps } from 'tailwind-variants';
import { createSplitProps } from './createSplitProps';

type GenericProps = Record<string, any>;
type GenericRecipeEntries = Record<string, (props: GenericProps) => string>;
type GenericRecipe = {
  (props: GenericProps): GenericRecipeEntries;
  variantKeys: (string | number | never)[];
};

export function createRecipeContext<
  Recipe extends GenericRecipe = GenericRecipe,
  RecipeProps extends GenericProps = VariantProps<Recipe>,
  RecipeEntries extends GenericRecipeEntries = ReturnType<Recipe>,
  RecipeEntry = keyof RecipeEntries
>(recipe: Recipe) {
  const RecipeContext = React.createContext<GenericRecipeEntries | null>(null);

  function useContext() {
    const context = React.useContext(RecipeContext);
    return context;
  }

  function withRootProvider<Props extends GenericProps>(
    Component: React.ComponentType<Props>
  ) {
    const StyledComponent = (props: Props) => {
      const [recipeProps, localProps] = createSplitProps(recipe.variantKeys)(
        props
      );

      const context = recipe(recipeProps);

      return (
        <RecipeContext.Provider value={context}>
          <Component {...(localProps as Props)} />
        </RecipeContext.Provider>
      );
    };

    return StyledComponent as unknown as React.ComponentType<
      Assign<Props, RecipeProps>
    >;
  }

  function withProvider<Props extends GenericProps>(
    Component: React.ComponentType<Props>,
    slot: RecipeEntry
  ) {
    const StyledComponent = React.forwardRef((props, ref) => {
      const [recipeProps, localProps] = createSplitProps(recipe.variantKeys)(
        props
      );

      const context = recipe(recipeProps);

      const slotName = slot as string;
      const getStyle = context[slotName];

      const userDefinedClassName =
        'className' in localProps && typeof localProps.className === 'string'
          ? localProps.className
          : undefined;

      const className = !getStyle
        ? userDefinedClassName
        : getStyle({
            ...recipeProps,
            className: userDefinedClassName,
          });

      return (
        <RecipeContext.Provider value={context}>
          <Component
            ref={ref}
            {...(localProps as Props)}
            className={className}
          />
        </RecipeContext.Provider>
      );
    });

    StyledComponent.displayName = Component.displayName || Component.name;

    return StyledComponent as React.ComponentType<Assign<Props, RecipeProps>>;
  }

  function withContext<Props extends GenericProps>(
    Component: React.ComponentType<Props>,
    slot: RecipeEntry
  ) {
    const StyledComponent = React.forwardRef((props, ref) => {
      const context = useContext();

      const [recipeProps, localProps] = createSplitProps(recipe.variantKeys)(
        props
      );

      const slotName = slot as string;
      const getStyle = !context
        ? recipe(recipeProps)[slotName]
        : context[slotName];

      const userDefinedClassName =
        'className' in localProps && typeof localProps.className === 'string'
          ? localProps.className
          : undefined;

      const className = !getStyle
        ? userDefinedClassName
        : getStyle({
            ...recipeProps,
            className: userDefinedClassName,
          });

      return (
        <Component ref={ref} {...(localProps as Props)} className={className} />
      );
    });

    StyledComponent.displayName = Component.displayName || Component.name;

    return StyledComponent as React.ComponentType<Assign<Props, RecipeProps>>;
  }

  return {
    withRootProvider,
    withProvider,
    withContext,
  };
}
