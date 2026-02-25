"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import BasicArea from "../chart/appex-chart/BasicArea";
import { useAuth } from "@/contexts/AuthContext";
import LoaderCircle from "@/components/Loader-circle";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";

// import images
import ProfileImage from "@/assets/images/users/user-1.jpg";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Use user from context directly
  // If user is not yet loaded, useAuth should handle loading state or user will be null

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <LoaderCircle />
      </div>
    );
  }

  const displayName = user?.fullName
    ? user.fullName
    : user?.username || user?.email || "Albert Flores";

  const email = user?.email || "info-500@progcoder.com";
  const phone = "+1-202-555-0151";
  const location = "Home# 320/N, Road# 71/B, Mohakhali, Dhaka-1207, Bangladesh";
  const jobTitle = "Front End Developer";

  return (
    <div>
      <div className="profile-page space-y-5">
        <div className="profiel-wrap relative z-1 items-end justify-between space-y-6 rounded-lg bg-white px-8.75 pt-10 pb-10 md:pt-21 lg:flex lg:space-y-0 dark:bg-slate-800">
          <div className="absolute top-0 left-0 z-[-1] h-37.5 w-full rounded-t-lg bg-slate-900 md:h-1/2 dark:bg-slate-700"></div>
          <div className="profile-box flex-none text-center md:text-start">
            <div className="items-end md:flex md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="relative mr-auto mb-4 ml-auto h-35 w-35 rounded-full ring-4 ring-slate-100 md:mr-0 md:mb-0 md:ml-0 md:h-46.5 md:w-46.5">
                  <img
                    src={ProfileImage.src}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                  <Link
                    href="#"
                    className="absolute top-25 right-2 flex h-8 w-8 flex-col items-center justify-center rounded-full bg-slate-50 text-slate-600 shadow-xs md:top-35">
                    <Icon icon="heroicons:pencil-square" />
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-0.75 text-2xl font-medium text-slate-900 dark:text-slate-200">
                  {displayName}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {jobTitle}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-500 max-w-129 flex-1 space-y-4 text-center md:flex md:space-y-0 md:text-start">
            <div className="flex-1">
              <div className="mb-1 text-base font-medium text-slate-900 dark:text-slate-300">
                $32,400
              </div>
              <div className="text-sm font-light text-slate-600 dark:text-slate-300">
                Total Balance
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-1 text-base font-medium text-slate-900 dark:text-slate-300">
                200
              </div>
              <div className="text-sm font-light text-slate-600 dark:text-slate-300">
                Board Card
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-1 text-base font-medium text-slate-900 dark:text-slate-300">
                3200
              </div>
              <div className="text-sm font-light text-slate-600 dark:text-slate-300">
                Calender Events
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <Card title="Info">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-xs leading-3 text-slate-500 uppercase dark:text-slate-300">
                      EMAIL
                    </div>
                    <a
                      href={`mailto:${email}`}
                      className="text-base text-slate-600 dark:text-slate-50">
                      {email}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-xs leading-3 text-slate-500 uppercase dark:text-slate-300">
                      PHONE
                    </div>
                    <a
                      href={`tel:${phone.replace(/\D/g, "")}`}
                      className="text-base text-slate-600 dark:text-slate-50">
                      {phone}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-xs leading-3 text-slate-500 uppercase dark:text-slate-300">
                      LOCATION
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      {location}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <Card title="User Overview">
              <BasicArea height={190} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
