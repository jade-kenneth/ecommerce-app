import { Group, InputElement } from '@chakra-ui/react';
import * as React from 'react';

export interface InputGroupProps
  extends React.ComponentPropsWithoutRef<typeof Group> {
  startElement?: React.ReactNode;
  startElementProps?: React.ComponentPropsWithoutRef<typeof InputElement>;
  endElement?: React.ReactNode;
  endElementProps?: React.ComponentPropsWithoutRef<typeof InputElement>;
  children: React.ReactElement;
  startOffset?: string;
  endOffset?: string;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      startElement,
      startElementProps,
      endElement,
      endElementProps,
      children,
      startOffset = '6px',
      endOffset = '6px',
      ...rest
    } = props;

    const child = React.Children.only(children);

    return (
      <Group ref={ref} {...rest}>
        {startElement && (
          <InputElement pointerEvents="none" {...startElementProps}>
            {startElement}
          </InputElement>
        )}
        {React.cloneElement(child, {
          ...(startElement && {
            ps: `calc(var(--input-height) - ${startOffset})`,
          }),
          ...(endElement && { pe: `calc(var(--input-height) - ${endOffset})` }),
          ...children.props,
        })}
        {endElement && (
          <InputElement placement="end" {...endElementProps}>
            {endElement}
          </InputElement>
        )}
      </Group>
    );
  }
);
