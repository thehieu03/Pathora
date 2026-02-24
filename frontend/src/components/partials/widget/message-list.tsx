import React from "react";
import Link from "next/link";
import { message } from "@/constant/data";

const MessageList = () => {
  const newMessage = message.slice(0, 5);
  return (
    <div>
      <ul className="-mx-6 -mb-6 divide-y divide-slate-100 dark:divide-slate-700!">
        {newMessage?.map((item, i) => (
          <li key={i}>
            <Link
              href="chat"
              className="dark:hover:bg-opacity-70 mb-2 block w-full cursor-pointer px-4 py-3 text-sm text-slate-600 last:mb-0 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              <div className="flex ltr:text-left rtl:text-right">
                <div className="flex-none ltr:mr-3 rtl:ml-3">
                  <div className="relative h-8 w-8 rounded-full bg-white dark:bg-slate-700">
                    <span
                      className={`${
                        item.active ? "bg-secondary-500" : "bg-success-500"
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
                  <div className="text-xs font-normal text-slate-600 hover:text-[#68768A] dark:text-slate-300">
                    {item.desc}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 dark:text-slate-400">
                    3 min ago
                  </div>
                </div>
                {item.hasnotifaction && (
                  <div className="flex-0">
                    <span className="bg-danger-500 flex h-4 w-4 items-center justify-center rounded-full border border-none text-[10px] text-white">
                      {item.notification_count}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
