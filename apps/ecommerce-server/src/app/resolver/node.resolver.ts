import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Node } from '../../types/common';

@Resolver('Node')
export class NodeResolver {
  @ResolveField('__resolveType')
  resolveType(@Parent() node: Node) {
    return node.nodeType;
  }
}
