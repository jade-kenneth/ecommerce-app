import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

const OBJECT_TYPE_TO_NODE_TYPE_MAPPING = ['Product'];
@Resolver('Node')
export class NodeResolver {
  @ResolveField('__resolveType')
  resolveType(@Parent() node: any) {
    const type = node.__typename || node.type || 'Product'; // fallback

    return OBJECT_TYPE_TO_NODE_TYPE_MAPPING[0] || null;
  }
}
