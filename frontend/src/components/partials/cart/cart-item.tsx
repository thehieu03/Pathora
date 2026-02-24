import React from "react";
import Icon from "@/components/ui/Icon";

type CartItemProps = {
  item: {
    id: string | number;
    img: string;
    name: string;
    price: number;
    quantity: number;
  };
  handleDecreaseQuantity: (id: string | number) => void;
  handleIncreaseQuantity: (id: string | number) => void;
  handleRemoveFromCart: (id: string | number) => void;
};

function CartItem({
  item,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleRemoveFromCart,
}: CartItemProps) {
  return (
    <div className="flex gap-4 rtl:space-x-reverse">
      <div className="shrink-0">
        <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-200 rounded-sm overflow-hidden">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover p-3"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-sm md:text-base font-normal text-slate-900 dark:text-white truncate">
          {item.name}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 pb-2">
          Price:{" "}
          <span className="text-xs font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-4 rtl:space-x-reverse">
          <div className="flex h-8 md:max-w-[112px] max-w-[95px] border border-slate-900 dark:border-slate-600 divide-x divide-slate-900 dark:divide-slate-600 text-sm font-normal rounded-sm rtl:divide-x-reverse">
            <button
              type="button"
              className="px-2 md:px-3 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
              onClick={() => handleDecreaseQuantity(item.id)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Icon icon="eva:minus-fill" />
            </button>

            <span
              className="flex-1 text-xs text-center flex items-center justify-center min-w-[40px]"
              aria-label={`${item.quantity} items`}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              className="px-2 md:px-3 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
              onClick={() => handleIncreaseQuantity(item.id)}
              disabled={item.quantity >= 10}
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Icon icon="eva:plus-fill" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleRemoveFromCart(item.id)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-900 dark:text-slate-400 hover:bg-danger-500 hover:text-white dark:hover:bg-danger-500 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-500"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Icon icon="heroicons:trash" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
