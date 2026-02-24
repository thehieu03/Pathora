import { Icon } from "@iconify/react";
import React from "react";
import { useSelector } from "react-redux";
import { motion, useCycle } from "framer-motion";
import CartPanel from "../../cart";
import { RootState } from "@/lib/store";

const HeaderCart = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const [isOpen, toggleOpen] = useCycle(false, true);

  const handleOpenCart = () => {
    toggleOpen();
  };
  return (
    <div>
      <motion.span
        onClick={handleOpenCart}
        className="relative flex cursor-pointer flex-col items-center justify-center rounded-full text-[20px] text-slate-900 lg:h-[32px] lg:w-[32px] lg:bg-slate-100 dark:text-white lg:dark:bg-slate-900"
      >
        <Icon icon="heroicons:shopping-cart" />
        <span className="absolute -top-2 -right-2 z-99 flex h-4 w-4 flex-col items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white lg:top-0 lg:right-0">
          {items.length}
        </span>
      </motion.span>
      <CartPanel close={handleOpenCart} open={isOpen} />
    </div>
  );
};

export default HeaderCart;
