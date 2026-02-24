import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import CounterButton from "@/components/partials/ecommerce/counter-button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/store/infrastructure/cartSlice";
import Link from "next/link";
import { RootState } from "@/lib/store";

const ProductList = ({ item }: { item: any }) => {
  const dispatch = useDispatch();
  const { name, category, img, rating, desc, price, oldPrice, percent, id } =
    item;
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <Card
      bodyClass="p-3 rounded-md 2xl:flex lg:flex md:flex-none sm:flex-none"
      className="group"
    >
      <Link href={item.id}>
        <div className="bg-secondary-200 relative mb-3 flex h-64.75 flex-col items-center justify-center rounded-md lg:mb-0 sm:ltr:mr-0 md:ltr:mr-0 lg:ltr:mr-3 sm:rtl:ml-0 md:rtl:ml-0 lg:rtl:ml-3 dark:rounded-sm">
          <div className="h-58.75 w-66.5 p-12">
            <img
              className="h-full w-full object-contain transition-all duration-300 group-hover:scale-105"
              src={img}
              alt={name}
            />
            {percent && (
              <Badge className="bg-danger-600 absolute top-3 font-normal text-white ltr:left-2 rtl:right-2">
                {percent}
              </Badge>
            )}
            <div className="hover-box invisible absolute top-2 flex flex-col opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 ltr:right-2 rtl:left-2">
              <button className="mb-1.5 rounded-full bg-white p-2.5">
                <Icon
                  icon="ph:heart-fill"
                  className="hover:text-danger-600 dark:hover:text-danger-600 text-slate-400 dark:text-slate-400"
                />
              </button>
              <button className="mb-1.5 rounded-full bg-white p-2.5">
                <Icon
                  icon="ph:eye"
                  className="hover:text-danger-600 dark:hover:text-danger-600 text-slate-400 dark:text-slate-400"
                />
              </button>
              <button className="mb-1.5 rounded-full bg-white p-2.5">
                <Icon
                  icon="jam:refresh-reverse"
                  className="hover:text-danger-600 dark:hover:text-danger-600 text-slate-400 dark:text-slate-400"
                />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <div>
        <p className="pb-2 text-xs font-normal text-slate-900 uppercase dark:text-slate-300">
          {category}
        </p>
        <h6 className="w-full truncate pb-2 text-lg font-medium text-slate-900 dark:text-slate-300">
          <Link href={item.id}>{name}</Link>
        </h6>
        <p className="space-x-2 pb-2 rtl:space-x-reverse">
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-300">
            ${price}
          </span>
          <del className="text-lg font-semibold text-slate-500 dark:text-slate-500">
            {oldPrice}
          </del>
        </p>
        {rating && (
          <span className="flex items-center space-x-1 pb-3 text-xs font-normal text-slate-900 rtl:space-x-reverse dark:text-slate-300">
            <Icon icon="ph:star-fill" className="text-yellow-400" />
            <Icon icon="ph:star-fill" className="text-yellow-400" />
            <Icon icon="ph:star-fill" className="text-yellow-400" />
            <Icon icon="ph:star-fill" className="text-yellow-400" />
            <span className="ltr:pl-2 rtl:pr-2">{rating}</span>
          </span>
        )}
        <p className="pb-4 text-sm font-normal text-slate-500 dark:text-slate-500">
          {desc}
        </p>
        <div className="flex max-w-92.5 space-x-4 rtl:space-x-reverse">
          <CounterButton product={item} />

          <button
            onClick={() => handleAddToCart(item)}
            disabled={cartItems.some((cartItem) => cartItem.id === id)}
            className="ml-3 flex max-w-50.5 items-center rounded-sm border border-slate-900 px-4 text-sm font-medium hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 rtl:mr-3 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <Icon icon="heroicons:shopping-bag" className="ltr:mr-2 rtl:ml-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductList;
