"use client";
import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { MenuItem } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/api/auth/authSlice";
import { useAuth } from "@/contexts/AuthContext";
import { RootState } from "@/lib/store";

import UserAvatar from "@/assets/images/all-img/user.png";

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);

  // In Test Mode/Redux, user is already set. No need to call service directly which might fail.
  const userInfo = user;
  const displayName =
    userInfo?.name || userInfo?.username || userInfo?.email || "User";

  const profileLabel = () => {
    return (
      <div className="flex items-center">
        <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
          <div className="h-7 w-7 rounded-full lg:h-8 lg:w-8">
            <img
              src={UserAvatar.src}
              alt=""
              className="block h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <div className="hidden flex-none items-center overflow-hidden text-sm font-normal text-ellipsis whitespace-nowrap text-slate-600 lg:flex dark:text-white">
          <span className="block w-[85px] overflow-hidden text-ellipsis whitespace-nowrap">
            {displayName}
          </span>
          <span className="inline-block text-base ltr:ml-[10px] rtl:mr-[10px]">
            <Icon icon="heroicons-outline:chevron-down"></Icon>
          </span>
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logOut());
    logout();
  };

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        router.push("/profile");
      },
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: handleLogout,
    },
  ];

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <MenuItem key={index}>
          <div
            onClick={() => item.action()}
            className="block text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            <div className={`block cursor-pointer px-4 py-2`}>
              <div className="flex items-center">
                <span className="block text-xl ltr:mr-3 rtl:ml-3">
                  <Icon icon={item.icon} />
                </span>
                <span className="block text-sm">{item.label}</span>
              </div>
            </div>
          </div>
        </MenuItem>
      ))}
    </Dropdown>
  );
};

export default Profile;
