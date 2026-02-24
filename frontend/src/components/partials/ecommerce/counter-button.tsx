import React from "react";
import Icon from "@/components/ui/Icon";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity } from "@/store/infrastructure/cartSlice";
import { RootState } from "@/lib/store";

const CounterButton = ({ product }: { product: { id: string } }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === product.id);

  const handleIncreaseQuantity = () => {
    if (cartItem && cartItem.quantity < 10) {
      dispatch(
        updateQuantity({ id: product.id, quantity: cartItem.quantity + 1 }),
      );
    }
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      dispatch(
        updateQuantity({ id: product.id, quantity: cartItem.quantity - 1 }),
      );
    }
  };

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <div className="flex h-8 flex-1 divide-x divide-slate-900 rounded-sm border-1 border-slate-900 text-sm font-normal delay-150 ease-in-out rtl:divide-x-reverse dark:divide-slate-600! dark:border-slate-600!">
        <button
          onClick={handleDecreaseQuantity}
          disabled={!cartItem || cartItem.quantity <= 1}
          type="button"
          className="flex-none px-2 text-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-slate-700"
        >
          <Icon icon="eva:minus-fill" />
        </button>

        <div className="flex w-15.5 flex-1 items-center justify-center text-center">
          {cartItem ? cartItem.quantity : 0}
        </div>
        <button
          onClick={handleIncreaseQuantity}
          disabled={!cartItem || cartItem.quantity >= 10}
          type="button"
          className="flex-none px-2 text-slate-900 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-slate-700 dark:hover:ltr:rounded-r dark:hover:rtl:rounded-l"
        >
          <Icon icon="eva:plus-fill" />
        </button>
      </div>
    </div>
  );
};

export default CounterButton;
