import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ObjectType } from '../../libs/object-shared';
import { Node } from '../../types/common';

const OBJECT_TYPE_TO_NODE_TYPE_MAPPING = {
  [ObjectType.Product]: 'Product',
};

@Resolver('Node')
export class NodeResolver {
  @ResolveField('__resolveType')
  resolveType(@Parent() node: Node) {
    const [type] = node._id.buffer;

    return OBJECT_TYPE_TO_NODE_TYPE_MAPPING[type] || null;
  }
}
