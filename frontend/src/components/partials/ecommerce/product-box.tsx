import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { current } from "@reduxjs/toolkit";
import CounterButton from "@/components/partials/ecommerce/counter-button";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "@/store/infrastructure/cartSlice";
import Link from "next/link";
import { RootState } from "@/lib/store";

const ProductBox = ({ item, wish }: { item: any; wish?: boolean }) => {
  const dispatch = useDispatch();

  const {
    name,
    category,
    img,
    rating,
    subtitle,
    price,
    oldPrice,
    percent,
    id,
  } = item;
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <Card bodyClass="p-4 rounded-md" className="group">
      <Link href={item.id}>
        <div className="bg-secondary-200 relative mb-3 flex h-47.75 flex-col items-center justify-center rounded-md dark:rounded-sm">
          <div className="h-36.5">
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
              {wish ? (
                <button className="hover:bg-danger-600 dark:hover:bg-danger-600 mb-1.5 rounded-full bg-white p-2.5 hover:text-white dark:text-slate-400 dark:hover:text-white">
                  <Icon icon="heroicons:trash" />
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-normal text-slate-900 uppercase dark:text-slate-300">
            {category}
          </p>
          {rating && (
            <span className="flex items-center space-x-1 text-xs font-normal text-slate-900 rtl:space-x-reverse dark:text-slate-300">
              <Icon icon="ph:star-fill" className="text-yellow-400" />
              <span>{rating}</span>
            </span>
          )}
        </div>
        <h6 className="mt-2 truncate text-base font-medium text-slate-900 dark:text-slate-300">
          <Link href={item.id}>{name}</Link>
        </h6>
        <p className="mt-1.5 text-[11px] font-normal text-slate-500 dark:text-slate-500">
          {subtitle}
        </p>
        <p className="pb-4">
          <span className="mt-2 text-base font-medium text-slate-900 ltr:mr-2 rtl:mr-2 dark:text-slate-300">
            ${price}
          </span>
          <del className="text-base font-normal text-slate-500 dark:text-slate-500">
            {oldPrice}
          </del>
        </p>
        {cartItems.some((cartItem) => cartItem.id === id) ? (
          <CounterButton product={item} />
        ) : (
          <Button
            onClick={() => handleAddToCart(item)}
            disabled={cartItems.some((cartItem) => cartItem.id === id)}
            text="Add to Cart"
            icon="heroicons:shopping-bag"
            className="btn-outline-dark btn-sm w-full font-medium hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 dark:hover:text-white"
            iconClass=" text-sm leading-none"
          />
        )}
      </div>
    </Card>
  );
};

export default ProductBox;
