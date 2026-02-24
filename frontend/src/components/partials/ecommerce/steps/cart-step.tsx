import React from "react";
import Icon from "@/components/ui/Icon";

import products1 from "@/assets/images/e-commerce/product-card/classical-black-tshirt.png";

import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/store/api/shop/cartSlice";
import { RootState } from "@/lib/store";

const CartStep = () => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };
  const handleIncreaseQuantity = (productId: string) => {
    const item = items.find((item) => item.id === productId);

    if (item && item.quantity < 10) {
      dispatch(updateQuantity({ id: productId, quantity: item.quantity + 1 }));
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const item = items.find((item) => item.id === productId);

    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ id: productId, quantity: item.quantity - 1 }));
    }
  };
  return (
    <div className="space-y-7 bg-white dark:bg-slate-800">
      <div className="overflow-x-auto border-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full table-fixed divide-y divide-slate-100 dark:divide-slate-700">
              <thead className="border-0 border-slate-100 dark:border-slate-800">
                <tr>
                  <th scope="col" className="table-th">
                    Product
                  </th>
                  <th scope="col" className="table-th">
                    Price
                  </th>
                  <th scope="col" className="table-th">
                    Quantity
                  </th>
                  <th scope="col" className="table-th">
                    Total
                  </th>
                  <th scope="col" className="table-th">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody className="divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800">
                {items.length > 0 ? (
                  items?.map((item, i) => (
                    <tr key={i}>
                      <td className="table-td flex items-center space-x-3 pb-3">
                        <div className="h-16 w-16 flex-none rounded-sm bg-slate-200 p-2 md:h-20 md:w-20 md:p-4 rtl:ml-3">
                          <img
                            className="h-full w-full object-contain"
                            src={item.img}
                            alt=""
                          />
                        </div>
                        <div>
                          <p className="w-[150px] truncate pb-1 text-sm font-medium text-slate-900 md:w-[380px] md:pb-2 md:text-base dark:text-slate-300">
                            {item.name}
                          </p>
                          <p className="text-sm font-medium text-slate-900 md:text-base dark:text-slate-300">
                            <span className="mr-1 font-normal text-slate-500 dark:text-slate-400">
                              Brand:
                            </span>
                            {item.brand}
                          </p>
                        </div>
                      </td>
                      <td className="table-td pb-3">${item.price}</td>
                      <td className="table-td pb-3">
                        <div className="flex h-8 min-w-[95px] flex-1 divide-x-[1px] divide-slate-900 rounded-sm border border-1 border-slate-900 text-sm font-normal delay-150 ease-in-out md:min-w-[112px] rtl:divide-x-reverse dark:divide-slate-600 dark:border-slate-600">
                          <button
                            className="px-2 disabled:cursor-not-allowed md:px-3"
                            onClick={() => handleDecreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <Icon icon="eva:minus-fill" />
                          </button>

                          <span className="flex flex-1 items-center justify-center text-center text-xs">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 disabled:cursor-not-allowed md:px-3"
                            onClick={() => handleIncreaseQuantity(item.id)}
                            disabled={item.quantity >= 10}
                          >
                            <Icon icon="eva:plus-fill" />
                          </button>
                        </div>
                      </td>
                      <td className="table-td pb-3">
                        ${item.price * item.quantity}
                      </td>
                      <td className="table-td pb-3">
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="mb-1.5 rounded-full bg-slate-100 p-2.5 text-slate-400 hover:bg-red-200 hover:text-red-600"
                        >
                          <Icon icon="heroicons:trash" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="table-td h-24 text-center" colSpan={5}>
                      No result's
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot className="mx-6">
                <tr className="border-t dark:border-slate-700">
                  <td className="table-td" colSpan={4}>
                    <p className="text-sm font-medium text-slate-500 md:text-base dark:text-slate-400">
                      Subtotal:
                    </p>
                  </td>
                  <td className="table-td">
                    <p className="text-sm font-medium text-slate-900 md:text-base dark:text-slate-300">
                      ${totalPrice}
                    </p>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartStep;
