import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = (colorTheme?: string, boxShadow?: string) =>
  defineRecipe({
    variants: {
      btnSize: {
        '2xl': {
          px: '1.5rem',
          py: '1rem',
          fontSize: '1.125rem',
          rounded: '32px',
        },
        xs: {
          px: '0.5rem',
          py: '0.25rem',
          fontSize: '0.75rem',
          rounded: '4px',
        },
        sm: {
          px: '0.75rem',
          py: '0.5rem',
          fontSize: '0.875rem',
          rounded: '6px',
        },
        md: { px: '1rem', py: '0.75rem', fontSize: '1rem', rounded: '8px' },
        lg: {
          px: '1.25rem',
          py: '0.875rem',
          fontSize: '1.125rem',
          rounded: '10px',
        },
      },
      visual: {
        solid: {
          bg: `colors.${colorTheme}.500`,
          color: 'white',
          boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',

          _hover: {
            bg: `colors.${colorTheme}.700`,
            _disabled: {
              bg: `colors.${colorTheme}.200`,
              opacity: 1,
            },
          },
          _focus: {
            boxShadow: boxShadow,
          },

          _expanded: {
            boxShadow: boxShadow,
          },
          _disabled: {
            bg: `colors.${colorTheme}.200`,
            opacity: 1,
          },

          _loading: {
            _hover: {
              bg: `colors.${colorTheme}.700`,
            },
          },

          //   ...(colorTheme === 'primary' && {
          //     _dark: {
          //       bg: 'yellow.700',
          //       color: 'neutrals.900',
          //       _hover: {
          //         bg: 'yellow.800',
          //       },
          //       _focus: {
          //         boxShadow: 'none',
          //       },
          //       _expanded: {
          //         boxShadow: 'none',
          //       },
          //       _disabled: {
          //         bg: 'neutrals.800',
          //         color: 'neutrals.700',
          //         border: '1px solid',
          //         borderColor: 'neutrals.700',
          //       },
          //     },
          //   }),
        },
        outline: {
          bg: 'white',
          color: `colors.${colorTheme}.700`,
          border: '1px solid',
          borderColor: `colors.${colorTheme}.300`,
          boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',

          _hover: {
            bg: `colors.${colorTheme}.50`,
            color: `colors.${colorTheme}.800`,
          },

          _focus: {
            color: `${colorTheme}.900`,
            boxShadow: boxShadow,
          },

          _expanded: {
            color: `${colorTheme}.900`,
            boxShadow: boxShadow,
          },

          _active: {
            bg: `colors.${colorTheme}.50`,
          },

          _disabled: {
            color: `colors.${colorTheme}.300`,
            borderColor: `colors.${colorTheme}.200`,
            opacity: 1,

            _hover: {
              color: `colors.${colorTheme}.300`,
              borderColor: `colors.${colorTheme}.200`,
            },
          },

          ...(colorTheme === 'gray' && {
            _dark: {
              bg: 'transparent',
              color: 'yellow.700',
              borderColor: 'yellow.700',
              _hover: {
                bg: 'yellow.50',
              },
              _focus: {
                boxShadow: 'none',
              },
              _expanded: {
                boxShadow: 'none',
              },
              _disabled: {
                bg: 'transparent',
                color: 'neutrals.700',
                border: '1px solid',
                borderColor: 'neutrals.700',
                _hover: {
                  bg: 'transparent',
                },
              },
            },
          }),
        },
      },
    },

    defaultVariants: {
      visual: 'solid',
      btnSize: 'lg',
    },
  });
