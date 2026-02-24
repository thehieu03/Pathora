import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { MenuItem } from "@headlessui/react";
import { message } from "@/constant/data";

const messagelabel = () => {
  return (
    <span className="relative flex cursor-pointer flex-col items-center justify-center rounded-full text-[20px] text-slate-900 lg:h-[32px] lg:w-[32px] lg:bg-slate-100 dark:text-white lg:dark:bg-slate-900">
      <Icon icon="heroicons-outline:mail" />
      <span className="absolute -top-2 -right-2 z-99 flex h-4 w-4 flex-col items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white lg:top-0 lg:right-0">
        10
      </span>
    </span>
  );
};
// message slice  0-4
const newMessage = message.slice(0, 4);

const Message = () => {
  return (
    <Dropdown
      classMenuItems="md:w-[335px] w-min top-[58px]"
      label={messagelabel()}
    >
      <div className="flex justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-600">
        <div className="text-sm leading-6 font-medium text-slate-800 dark:text-slate-200">
          Messages
        </div>
        <div className="text-xs text-slate-800 md:text-right dark:text-slate-200">
          <Link href="/chat" className="underline">
            View all
          </Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {newMessage?.map((item, i) => (
          <MenuItem key={i}>
            <div
              className={`block w-full cursor-pointer px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600`}
            >
              <div className="flex space-x-3 ltr:text-left rtl:space-x-reverse rtl:text-right">
                <div className="flex-none">
                  <div className="relative h-8 w-8 rounded-full bg-white dark:bg-slate-700">
                    <span
                      className={`${
                        item.active ? "bg-secondary-500" : "bg-green-500"
                      } absolute top-0 right-0 inline-block h-[10px] w-[10px] rounded-full border border-white dark:border-slate-700`}
                    ></span>
                    <img
                      src={
                        typeof item.image === "string"
                          ? item.image
                          : item.image.src
                      }
                      alt=""
                      className="block h-full w-full rounded-full border border-transparent object-cover hover:border-white"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-1` text-sm font-medium text-slate-800 dark:text-slate-300">
                    {item.title}
                  </div>
                  <div className="mb-1 text-xs text-slate-600 hover:text-[#68768A] dark:text-slate-300">
                    {item.desc}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-400">
                    3 min ago
                  </div>
                </div>
                {item.hasnotifaction && (
                  <div className="flex-0">
                    <span className="bg-danger-500 flex h-4 w-4 items-center justify-center rounded-full border border-white text-[10px] text-white">
                      {item.notification_count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </MenuItem>
        ))}
      </div>
    </Dropdown>
  );
};

export default Message;
