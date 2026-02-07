import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import assert from 'assert';

import { Types } from 'mongoose';
import { Filter } from '../../libs/repository';
import { AccountType } from '../../types/common';
import {
  AddToCartInput,
  CartItem,
  CheckoutInput,
  Order,
  RemoveFromCartInput,
} from '../__generated/graphql-types';
import { ProductsService } from '../products/products.service';
import { Claims } from '../user-session/types';
import { CartsService } from './carts.service';
import { Cart } from './repositories/carts.repository';

@Resolver('Cart')
export class CartResolver {
  constructor(
    private readonly cartService: CartsService,
    private readonly products: ProductsService,
  ) {}

  @Query('cart')
  async carts(
    @Context('claims') claims: Claims,
    @Args('first') first: number,
    @Args('after') after: string,
    @Args('filter') filter?: Filter<Cart>,
  ) {
    /** This query requires authentication that comes from middleware
     *
     * If claims.role is missing, it means the token is invalid
     */
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.cartService.findCart(new Types.ObjectId(claims.sub));
  }

  @Mutation('addToCart')
  async addToCart(
    @Context('claims') claims: Claims,
    @Args('input') input: AddToCartInput,
  ) {
    return this.cartService.addToCart({
      params: { ...input, _id: claims.sub },
    });
  }

  @Mutation('removeFromCart')
  async removeFromCart(
    @Context('claims') claims: Claims,
    @Args('input') input: RemoveFromCartInput,
  ) {
    return this.cartService.removeFromCart(input.productId, {
      _id: claims.sub,
      quantity: input.quantity,
    });
  }

  @Query('shippingOptions')
  async shippingOptions() {
    return this.cartService.shippingOptions();
  }

  @Query('paymentMethods')
  async paymentMethods() {
    return this.cartService.paymentMethods();
  }

  @Query('myOrders')
  async myOrders(@Context('claims') claims: Claims) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.cartService.myOrders(new Types.ObjectId(claims.sub));
  }

  @Query('order')
  async order(@Context('claims') claims: Claims, @Args('id') id: string) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.cartService.findOrder(
      new Types.ObjectId(claims.sub),
      new Types.ObjectId(id),
    );
  }

  @Mutation('checkout')
  async checkout(
    @Context('claims') claims: Claims,
    @Args('input') input: CheckoutInput,
  ) {
    assert(claims.role === AccountType.Member, 'unauthorized');

    return this.cartService.checkout({ accountId: claims.sub, input });
  }
  @ResolveField('subtotal')
  resolveTotalPrice(@Parent() cart: Cart) {
    if (cart.subtotal) return cart.subtotal;

    const subtotal = cart.items.reduce((acc, item) => {
      const totalPrice = Number(item.totalPrice ?? 0);
      return acc + totalPrice;
    }, 0);

    return subtotal.toFixed(2).toString();
  }

  @ResolveField('total')
  resolveTotal(@Parent() cart: Cart) {
    if (cart.total) return cart.total;

    const subtotal = Number(cart.subtotal ?? 0);
    const tax = Number(cart.tax ?? 0);
    const shippingFee = Number(cart.shippingFee ?? 0);

    return (subtotal + tax + shippingFee).toFixed(2).toString();
  }

  @ResolveField('items')
  resolveCartItems(@Parent() cart: Cart) {
    return (cart.items ?? []).filter(
      (item): item is CartItem => !!item?.productId,
    );
  }
  // ** build later **

  // @Mutation('create')
  // async updateProduct(@Args('input') input: UpdateProductInput) {
  //   return this.productService.updateProduct(input);
  // }

  // @Mutation('deleteProduct')
  // async deleteProduct(@Args('input') input: DeleteProductInput) {
  //   return this.productService.deleteProduct(input);
  // }
}

@Resolver('Order')
export class OrderResolver {
  @ResolveField('total')
  resolveTotal(@Parent() order: Order) {
    if (order.total) return order.total;

    const totalPrice =
      order.items?.reduce((acc, item) => {
        const itemTotal = Number(item?.totalPrice ?? 0);
        return acc + itemTotal;
      }, 0) ?? 0;

    const subtotal = Number(totalPrice ?? 0);
    const tax = Number(order.tax ?? 0);
    const shippingFee = Number(order.shippingFee ?? 0);

    return (subtotal + tax + shippingFee).toFixed(2).toString();
  }

  @ResolveField('items')
  resolveOrderItems(@Parent() order: Order) {
    return (order.items ?? []).filter(
      (item): item is CartItem => !!item?.productId,
    );
  }
}
@Resolver('CartItem')
export class CartItemResolver {
  constructor(private readonly products: ProductsService) {}

  @ResolveField('totalPrice')
  async resolveTotalPrice(@Parent() item: CartItem) {
    if (!item?.productId) return item?.totalPrice ?? '0';

    const product = await this.products.findProduct(
      new Types.ObjectId(item.productId),
    );

    if (!product) return item.totalPrice ?? '0';

    const quantity = item.quantity ?? 0;
    const total = Number(product.price) * Number(quantity);
    return total.toFixed(2).toString();
  }
}
