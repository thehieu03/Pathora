import React, { Fragment } from "react";
import Icon from "@/components/ui/Icon";
import SimpleBar from "simplebar-react";
import { useSelector, useDispatch } from "react-redux";
import { motion, useCycle } from "framer-motion";
import Button from "@/components/ui/Button";
import { removeFromCart, updateQuantity } from "@/store/api/shop/cartSlice";
import CartItem from "./cart-item";
import NoItem from "./no-item";
import clsx from "clsx";
import { RootState } from "@/store";

const variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring" as const,
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 160px 50px )",
    transition: {
      delay: 0.34,
      type: "spring" as const,
      stiffness: 400,
      damping: 40,
    },
  },
};

const variants2 = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const CartPanel = ({ open, close }: { open: boolean; close: () => void }) => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };
  const handleIncreaseQuantity = (productId: string) => {
    const item = items.find((item) => item.id === productId);

    if (item && item.quantity < 10) {
      dispatch(updateQuantity({ id: productId, quantity: item.quantity + 1 }));
    }
  };

  const handleDecreaseQuantity = (productId: string) => {
    const item = items.find((item) => item.id === productId);

    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ id: productId, quantity: item.quantity - 1 }));
    }
  };
  return (
    <div>
      <motion.div
        className={`setting-wrapper shadow-base2 dark:shadow-base3 fixed top-0 z-9999 h-screen w-[300px] border border-slate-200 bg-white md:w-[400px] ltr:right-0 rtl:left-0 dark:border-slate-700 dark:bg-slate-800 ${open ? "ml-0" : "ml-[-400px]"} `}
        animate={open ? "open" : "closed"}
        variants={variants}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6">
          <header className="sticky top-0 -mx-5 mb-6 flex flex-none items-center justify-between border-b border-slate-100 bg-white px-6 py-[15px] dark:border-slate-700 dark:bg-slate-800">
            <div>
              <span className="block text-xl font-medium text-slate-900 dark:text-[#eee]">
                Cart
              </span>
              <span className="block text-sm font-light text-[#68768A] dark:text-[#eee]">
                Total Price ${totalPrice}
              </span>
            </div>
            <div
              className="cursor-pointer text-2xl text-slate-800 dark:text-slate-200"
              onClick={close}
            >
              <Icon icon="heroicons-outline:x" />
            </div>
          </header>
          <motion.div
            className={clsx(
              "flex-1 divide-y divide-slate-200 dark:divide-slate-700",
              {
                "flex flex-col justify-center": items.length <= 0,
              },
            )}
          >
            {items.length > 0 ? (
              items?.map((item, i) => (
                <motion.div
                  variants={variants2}
                  key={i}
                  className="-mx-6 px-6 py-5"
                >
                  <CartItem
                    handleRemoveFromCart={handleRemoveFromCart}
                    handleIncreaseQuantity={handleIncreaseQuantity}
                    handleDecreaseQuantity={handleDecreaseQuantity}
                    item={item}
                  />
                </motion.div>
              ))
            ) : (
              <NoItem />
            )}
          </motion.div>

          <footer className="sticky bottom-0 -mx-6 flex-none space-y-4 border-t border-slate-200 bg-white px-6 py-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between text-base leading-none font-medium text-slate-900 dark:text-white">
              <span>Subtotal:</span>
              <span>${totalPrice}</span>
            </div>
            {items.length > 0 && (
              <div className="flex justify-between space-x-3 rtl:space-x-reverse">
                <Button
                  text="Continue to Shipping"
                  className="btn-dark flex-1"
                />
                <Button
                  text="View Cart"
                  className="btn-dark flex-1"
                  link="cart"
                />
              </div>
            )}
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default CartPanel;
