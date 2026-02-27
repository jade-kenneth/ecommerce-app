'use client';
import { Assign, mergeProps } from '@ark-ui/react';
import { omit, pick } from 'es-toolkit';
import * as React from 'react';
import { VariantProps } from 'tailwind-variants';
import { Simplify } from 'type-fest';

type GenericProps = Record<string, unknown>;
type GenericRecipeEntries = Record<
  string,
  (props: GenericProps & { className?: string }) => string
>;
type GenericRecipe = {
  (props: GenericProps): GenericRecipeEntries;
  variantKeys: (string | number | never)[];
};

export function createRecipeContext<
  Recipe extends GenericRecipe = GenericRecipe,
  RecipeProps extends GenericProps = VariantProps<Recipe>,
  RecipeEntries extends GenericRecipeEntries = ReturnType<Recipe>,
  RecipeEntry = keyof RecipeEntries,
>(recipe: Recipe) {
  const RecipeContext = React.createContext<GenericRecipeEntries | null>(null);
  const variantKeys = recipe.variantKeys.filter(
    (key): key is string => typeof key === 'string',
  );

  function useContext() {
    const context = React.useContext(RecipeContext);
    return context;
  }

  function withRootProvider<Props extends object>(
    Component: React.ComponentType<Props>,
    defaultProps: Partial<Props> = {},
  ) {
    const StyledComponent = (props: Assign<Props, RecipeProps>) => {
      const [recipeProps, localProps] = splitProps(
        props as Record<string, unknown>,
        variantKeys,
      );

      const context = recipe(recipeProps as GenericProps);

      const mergedProps = mergeProps(
        defaultProps as Record<string, unknown>,
        localProps,
      ) as Props;

      return (
        <RecipeContext.Provider value={context}>
          <Component {...mergedProps} />
        </RecipeContext.Provider>
      );
    };

    return StyledComponent as React.ComponentType<Assign<Props, RecipeProps>>;
  }

  function withProvider<Props extends object>(
    Component: React.ComponentType<Props>,
    slot: RecipeEntry,
  ) {
    const StyledComponent = React.forwardRef<unknown, Assign<Props, RecipeProps>>((props, ref) => {
      const [recipeProps, localProps] = splitProps(
        props as Record<string, unknown>,
        variantKeys,
      );

      const context = recipe(recipeProps as GenericProps);

      const slotName = slot as string;
      const getStyle = context[slotName];

      const userDefinedClassName =
        'className' in localProps && typeof localProps.className === 'string'
          ? localProps.className
          : undefined;

      const className = !getStyle
        ? userDefinedClassName
        : getStyle({
            ...(recipeProps as GenericProps),
            className: userDefinedClassName,
          });

      const ComponentWithClassName = Component as React.ComponentType<
        Props & { className?: string; ref?: React.Ref<unknown> }
      >;

      return (
        <RecipeContext.Provider value={context}>
          <ComponentWithClassName
            ref={ref}
            {...(localProps as Props)}
            className={className}
          />
        </RecipeContext.Provider>
      );
    });

    StyledComponent.displayName = Component.displayName || Component.name;

    return StyledComponent;
  }

  function withContext<Props extends object>(
    Component: React.ComponentType<Props>,
    slot: RecipeEntry,
  ) {
    const StyledComponent = React.forwardRef<unknown, Assign<Props, RecipeProps>>((props, ref) => {
      const context = useContext();

      const [recipeProps, localProps] = splitProps(
        props as Record<string, unknown>,
        variantKeys,
      );

      const slotName = slot as string;
      const getStyle = !context
        ? recipe(recipeProps as GenericProps)[slotName]
        : context[slotName];

      const userDefinedClassName =
        'className' in localProps && typeof localProps.className === 'string'
          ? localProps.className
          : undefined;

      const className = !getStyle
        ? userDefinedClassName
        : getStyle({
            ...(recipeProps as GenericProps),
            className: userDefinedClassName,
          });

      const ComponentWithClassName = Component as React.ComponentType<
        Props & { className?: string; ref?: React.Ref<unknown> }
      >;

      return (
        <ComponentWithClassName
          ref={ref}
          {...(localProps as Props)}
          className={className}
        />
      );
    });

    StyledComponent.displayName = Component.displayName || Component.name;

    return StyledComponent;
  }

  return {
    withRootProvider,
    withProvider,
    withContext,
  };
}

export function splitProps<T extends Record<string, unknown>, K extends keyof T>(
  props: T,
  keys: readonly K[],
): [Simplify<Pick<T, K>>, Simplify<Omit<T, K>>] {
  const a = pick(props, keys);
  const b = omit(props, keys);

  return [a, b];
}
