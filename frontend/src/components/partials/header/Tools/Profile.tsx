"use client";
import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { MenuItem } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/api/auth/authSlice";
import { RootState } from "@/lib/store";

import UserAvatar from "@/assets/images/all-img/user.png";

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const userInfo = user;
  const displayName =
    userInfo?.fullName || userInfo?.username || userInfo?.email || "User";

  const profileLabel = () => (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-2.5 rtl:ml-2.5">
        <div className="h-7 w-7 rounded-full lg:h-8 lg:w-8">
          <img
            src={UserAvatar.src}
            alt={`${displayName}'s avatar`}
            className="block h-full w-full rounded-full object-cover"
          />
        </div>
      </div>
      <div className="hidden flex-none items-center overflow-hidden text-sm font-normal text-ellipsis whitespace-nowrap text-slate-600 lg:flex dark:text-white">
        <span className="block w-21.25 overflow-hidden text-ellipsis whitespace-nowrap">
          {displayName}
        </span>
        <span className="inline-block text-base ltr:ml-2.5 rtl:mr-2.5">
          <Icon icon="heroicons-outline:chevron-down" aria-hidden="true" />
        </span>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logOut());
    router.push("/login");
  };

  const profileMenuItems = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",
      onClick: () => router.push("/profile"),
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-45 top-14.5">
      {profileMenuItems.map((item, index) => (
        <MenuItem key={index}>
          {({ focus }) => (
            <button
              onClick={item.onClick}
              className={`block w-full text-left focus:outline-none ${
                focus
                  ? "bg-slate-100 text-slate-800 dark:bg-slate-600/50 dark:text-slate-300"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <span className="flex items-center px-4 py-2">
                <Icon
                  icon={item.icon}
                  className="block text-xl ltr:mr-3 rtl:ml-3"
                  aria-hidden="true"
                />
                <span className="block text-sm">{item.label}</span>
              </span>
            </button>
          )}
        </MenuItem>
      ))}
    </Dropdown>
  );
};

export default Profile;
