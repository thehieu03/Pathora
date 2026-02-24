import React, { useState } from "react";
import Radio from "@/components/ui/Radio";
import PickupModal from "./pickup-modal";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const DeliveryInfo = () => {
  const [value, setValue] = useState("A");
  const [isOpen, setOpen] = useState(false);
  const handleChange = (e) => {
    setValue(e.target.value);
    if (e.target.value === "B") {
      setOpen(true);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setValue("A");
  };
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  return (
    <>
      <div className="card rounded-xs p-5 dark:border-slate-700">
        <h3 className="pb-3 text-base font-semibold text-slate-800 uppercase dark:text-slate-200">
          Your Orders
        </h3>
        <div className="card space-y-4 rounded-xs border p-5 dark:border-slate-700">
          {items?.map((item, i) => (
            <div
              className="flex items-center gap-3 sm:flex-col md:flex-row"
              key={i}
            >
              <div className="h-16 w-16 flex-none rounded-sm bg-slate-200 p-2 md:h-20 md:w-20 md:p-4 rtl:ml-3">
                <img
                  className="h-full w-full object-contain"
                  src={item.img}
                  alt={item.name}
                />
              </div>
              <div className="text-sm md:text-base">
                <p className="line-clamp-2 pb-1 font-medium text-slate-900 md:pb-2 dark:text-slate-300">
                  {item.name}
                </p>
                <p className="font-medium text-slate-900 dark:text-slate-300">
                  <span className="mr-1 font-normal text-slate-500 dark:text-slate-400">
                    Brand:
                  </span>
                  {item.brand}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 items-center space-y-5 md:mt-10 lg:flex lg:space-y-0 lg:space-x-4">
          <p className="flex flex-none text-base font-medium text-slate-800 dark:text-slate-300">
            Choose Delivery Type
          </p>
          <div className="flex-1 justify-start space-y-3 text-sm md:flex md:space-y-0 md:space-x-5 md:text-base lg:justify-end rtl:space-x-reverse">
            <label className="inline-flex w-[200px] items-center rounded-sm border border-slate-900 px-5 py-3 md:w-auto lg:px-10 dark:border-slate-700">
              <Radio
                name="x"
                value="A"
                checked={value === "A"}
                onChange={handleChange}
              />
              <span className="text-slate-900 dark:text-slate-300">
                Home Delivery
              </span>
            </label>
            <label className="inline-flex w-[200px] items-center rounded-sm border border-slate-900 px-5 py-3 md:w-auto lg:px-10 dark:border-slate-700">
              <Radio
                name="x"
                value="B"
                checked={value === "B"}
                onChange={handleChange}
              />
              <span className="text-slate-900 dark:text-slate-300">
                Local Pickup
              </span>
            </label>
          </div>
        </div>
      </div>
      <PickupModal activeModal={isOpen} onClose={handleCloseModal} />
    </>
  );
};

export default DeliveryInfo;
