import React from "react";
import { FaGoogle } from "react-icons/fa";
// import images
import Twitter from "@/assets/images/icon/tw.svg";
import FaceBook from "@/assets/images/icon/fb.svg";
import LinkedIn from "@/assets/images/icon/in.svg";

const Social = () => {
  return (
    <ul className="flex">
      <li className="flex-1">
        <a
          href="#"
          className="inline-flex h-10 w-10 bg-[#1C9CEB] text-white text-2xl flex-col items-center justify-center rounded-full">
          <img src={Twitter} alt="" />
        </a>
      </li>
      <li className="flex-1">
        <a
          href="#"
          className="inline-flex h-10 w-10 bg-[#395599] text-white text-2xl flex-col items-center justify-center rounded-full">
          <img src={FaceBook} alt="" />
        </a>
      </li>
      <li className="flex-1">
        <a
          href="#"
          className="inline-flex h-10 w-10 bg-[#0A63BC] text-white text-2xl flex-col items-center justify-center rounded-full">
          <img src={LinkedIn} alt="" />
        </a>
      </li>
      <li className="flex-1">
        <a
          href="#"
          className="inline-flex h-10 w-10 bg-[#EA4335] text-white text-2xl flex-col items-center justify-center rounded-full">
          <FaGoogle aria-hidden="true" />
        </a>
      </li>
    </ul>
  );
};

export default Social;
