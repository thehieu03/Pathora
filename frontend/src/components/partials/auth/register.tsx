"use client";
import React, { useState } from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import RegForm from "./common/reg-from";
import Social from "./common/social";
import { ToastContainer } from "react-toastify";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.png";
import Illustration from "@/assets/images/auth/ils1.svg";

const Register = () => {
  const [isDark] = useDarkMode();

  return (
    <div className="loginwrapper">
      <div className="lg-inner-column">
        <div className="left-column relative z-1">
          <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
            <Link href="/">
              <img
                src={isDark ? LogoWhite : Logo}
                alt="Pathora logo"
                className="mb-10"
              />
            </Link>

            <h1 className="text-4xl font-semibold">
              Unlock your Project
              <span className="text-slate-800 dark:text-slate-400 font-bold">
                {" "}
                performance
              </span>
            </h1>
          </div>
          <div className="absolute left-0 bottom-[-130px] h-full w-full z-[-1]">
            <img
              src={Illustration}
              alt=""
              className="h-full w-full object-contain"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="right-column relative bg-white dark:bg-slate-800">
          <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
            <div className="auth-box h-full flex flex-col justify-center">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link href="/">
                  <img
                    src={isDark ? LogoWhite : Logo}
                    alt="Pathora logo"
                    className="mx-auto"
                  />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-5">
                <h2 className="font-medium text-2xl">Sign up</h2>
                <p className="text-slate-500 dark:text-slate-400 text-base mt-2">
                  Create an account to start using Pathora
                </p>
              </div>
              <RegForm />
              <div className="relative border-b-[#9AA2AF]/15 border-b pt-6">
                <div className="absolute inline-block bg-white dark:bg-slate-800 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 dark:text-slate-400 font-normal">
                  Or continue with
                </div>
              </div>
              <div className="max-w-[242px] mx-auto mt-8 w-full">
                <Social />
              </div>
              <div className="max-w-[215px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-6 uppercase text-sm">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="auth-footer text-center">
              Copyright {new Date().getFullYear()}, Pathora All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
