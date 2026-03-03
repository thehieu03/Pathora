"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import Textarea from "@/components/ui/Textarea";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import Sidebar from "./Sidebar";

// import images
import post1Img from "@/assets/images/all-img/post-1.png";
import twitterImg from "@/assets/images/svg/tw.svg";
import facebookImg from "@/assets/images/svg/fb.svg";
import linkedInImg from "@/assets/images/svg/ln.svg";
import instagramImg from "@/assets/images/svg/ins.svg";
import comment1Img from "@/assets/images/post/c1.png";
import comment2Img from "@/assets/images/post/c2.png";
import comment3Img from "@/assets/images/post/c3.png";

const tags = [
  {
    title: "Business",
    link: "#",
  },
  {
    title: "Consulting",
    link: "#",
  },
  {
    title: "Photographic",
    link: "#",
  },
  {
    title: "Investment",
    link: "#",
  },
];

const BlogDetailsPage = () => {
  return (
    <div>
      <div className="blog-posts flex-wrap space-y-5 lg:flex lg:space-y-0 lg:space-x-5 rtl:space-x-reverse">
        <div className="flex-none">
          <div className="lg:max-w-90">
            <Card>
              <Sidebar />
            </Card>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-5">
            <Card>
              <div className="mb-6 h-62 w-full">
                <img
                  src={post1Img.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mb-4 flex justify-between">
                <Link href="#">
                  <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-500">
                    <Icon
                      icon="heroicons-outline:calendar"
                      className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-500"
                    />
                    10/02/2021
                  </span>
                </Link>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <Link href="#">
                    <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-500">
                      <Icon
                        icon="heroicons-outline:chat"
                        className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-500"
                      />
                      3
                    </span>
                  </Link>
                  <Link href="#">
                    <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-500">
                      <Icon
                        icon="heroicons-outline:share"
                        className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-500"
                      />
                      4
                    </span>
                  </Link>
                </div>
              </div>
              <h5 className="card-title text-slate-900">
                <Link href="#">
                  At Healthcare you will be treated by caring
                </Link>
              </h5>
              <div className="card-text mt-4 space-y-4 border-b border-slate-100 pb-6 text-sm leading-5 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip.Lorem ipsum dolor sit amet,
                  consectetur adipiscing eli.
                </p>
                <p className="text-base font-medium">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum!
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididun ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ulla mco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehende rit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididun ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ulla mco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehende rit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididun ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam.
                </p>
              </div>
              <div className="mt-6">
                <ul className="flex items-center space-x-3 rtl:space-x-reverse">
                  <li className="dark:text-slate-300">share:</li>
                  <li>
                    <a href="#">
                      <img src={twitterImg} alt="" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src={facebookImg} alt="" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src={linkedInImg} alt="" />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <img src={instagramImg} alt="" />
                    </a>
                  </li>
                </ul>
                <ul className="mt-4 items-center border-b border-slate-100 pb-6 lg:flex lg:space-x-3 lg:rtl:space-x-reverse dark:border-slate-700">
                  <li className="dark:text-slate-300">Popular tags:</li>
                  {tags.map((item, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-normal text-slate-600 transition duration-150 hover:bg-slate-900 hover:text-white dark:bg-slate-600 dark:text-slate-300"
                      >
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="comments mt-6 space-y-4">
                  <li className="block">
                    <div className="flex">
                      <div className="flex-none">
                        <div className="h-14 w-14 rounded-full ltr:mr-6 rtl:ml-6">
                          <img
                            src={comment1Img.src}
                            alt=""
                            className="block h-full w-full rounded-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap justify-between">
                          <span className="text-base font-normal text-slate-600 dark:text-slate-300">
                            Marvin McKinney
                          </span>

                          <span className="flex items-center space-x-1 text-sm text-slate-500 rtl:space-x-reverse dark:text-slate-500">
                            <Icon
                              icon="heroicons:clock"
                              className="text-base"
                            />
                            <span>Oct 09, 2021</span>
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididun ut lab ore et
                          dolore magna aliqua.
                        </p>
                        <div className="mt-2">
                          <Link
                            href="#"
                            className="flex items-center space-x-2 text-xs font-medium rtl:space-x-reverse dark:text-slate-500"
                          >
                            <span>Reply</span>
                            <Icon
                              icon="heroicons:arrow-right-20-solid"
                              className="text-lg"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <ul className="comments mt-4 pl-8">
                      <li className="block">
                        <div className="flex">
                          <div className="flex-none">
                            <div className="h-14 w-14 rounded-full ltr:mr-6 rtl:ml-6">
                              <img
                                src={comment2Img.src}
                                alt=""
                                className="block h-full w-full rounded-full object-contain"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap justify-between">
                              <span className="text-base font-normal text-slate-600 dark:text-slate-300">
                                Marvin McKinney
                              </span>

                              <span className="flex items-center space-x-1 text-sm text-slate-500 rtl:space-x-reverse dark:text-slate-500">
                                <Icon
                                  icon="heroicons:clock"
                                  className="text-base"
                                />

                                <span>Oct 09, 2021</span>
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididun ut lab ore
                              et dolore magna aliqua.
                            </p>
                            <div className="mt-2">
                              <Link
                                href="#"
                                className="flex items-center space-x-2 text-xs font-medium rtl:space-x-reverse dark:text-slate-500"
                              >
                                <span>Reply</span>
                                <Icon
                                  icon="heroicons:arrow-right-20-solid"
                                  className="text-lg"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className="block">
                    <div className="flex">
                      <div className="flex-none">
                        <div className="h-14 w-14 rounded-full ltr:mr-6 rtl:ml-6">
                          <img
                            src={comment3Img.src}
                            alt=""
                            className="block h-full w-full rounded-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex flex-wrap justify-between">
                          <span className="text-base font-normal text-slate-600 dark:text-slate-300">
                            Marvin McKinney
                          </span>

                          <span className="flex items-center space-x-1 text-sm text-slate-500 rtl:space-x-reverse dark:text-slate-500">
                            <Icon
                              icon="heroicons:clock"
                              className="text-base"
                            />

                            <span>Oct 09, 2021</span>
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididun ut lab ore et
                          dolore magna aliqua.
                        </p>
                        <div className="mt-2">
                          <Link
                            href="#"
                            className="flex items-center space-x-2 text-xs font-medium rtl:space-x-reverse dark:text-slate-500"
                          >
                            <span>Reply</span>
                            <Icon
                              icon="heroicons:arrow-right-20-solid"
                              className="text-lg"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="post-comments mt-6 rounded-md bg-slate-100 p-6 dark:bg-slate-900">
                  <h4 className="mb-4 text-lg font-medium text-slate-500 dark:text-slate-100">
                    Leave a comment
                  </h4>
                  <form action="#">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      <div className="lg:col-span-2">
                        <Textarea
                          label="Comment"
                          placeholder="writte your comment"
                        />
                      </div>
                      <TextInput
                        label="Full name"
                        placeholder="Full name"
                        type="text"
                      />
                      <TextInput
                        label="Email"
                        placeholder="Email Address"
                        type="email"
                      />
                    </div>
                    <div className="text-right">
                      <Button
                        text="Post comment"
                        type="submit"
                        className="btn-dark mt-3"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
