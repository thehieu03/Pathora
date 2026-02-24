import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import Sidebar from "./Sidebar";

// import images
import post1Img from "@/assets/images/all-img/post-1.png";

const BlogPage = () => {
  return (
    <div className="blog-posts flex-wrap space-y-5 lg:flex lg:space-y-0 lg:space-x-5 rtl:space-x-reverse">
      <div className="flex-none">
        <div className="lg:max-w-90">
          <Card>
            <Sidebar />
          </Card>
        </div>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="col-span-1 xl:col-span-2">
            <Card>
              <div className="mb-6 h-62 w-full">
                <img
                  src={post1Img.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mb-4 flex justify-between">
                <Link href="/blog-details">
                  <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-400">
                    <Icon
                      icon="heroicons-outline:calendar"
                      className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-400"
                    />
                    10/02/2021
                  </span>
                </Link>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <Link href="#">
                    <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-400">
                      <Icon
                        icon="heroicons-outline:chat"
                        className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-400"
                      />
                      3
                    </span>
                  </Link>
                  <Link href="#">
                    <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-400">
                      <Icon
                        icon="heroicons-outline:share"
                        className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-400"
                      />
                      4
                    </span>
                  </Link>
                </div>
              </div>
              <h5 className="card-title text-slate-900">
                <Link href="/blog-details">
                  At Healthcare you will be treated by caring
                </Link>
              </h5>
              <div className="card-text mt-4 space-y-4 dark:text-slate-300">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip.Lorem ipsum dolor sit amet,
                  consectetur adipiscing eli.
                </p>
                <Button
                  className="btn-outline-dark"
                  text="Read more"
                  link="#"
                />
              </div>
            </Card>
          </div>
          <Card bodyClass="p-0">
            <div className="mb-6 h-62 w-full">
              <img
                src={post1Img.src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="px-6 pb-6">
              <div className="mb-4 flex justify-between">
                <div>
                  <h5 className="card-title text-slate-900">
                    <Link href="#">Lorem ipsum</Link>
                  </h5>
                </div>
                <Link href="#">
                  <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-400">
                    <Icon
                      icon="heroicons-outline:calendar"
                      className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-400"
                    />
                    10/02/2021
                  </span>
                </Link>
              </div>

              <div className="card-text mt-4 dark:text-slate-300">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="mt-4 space-x-4 rtl:space-x-reverse">
                  <Link href="#" className="btn-link">
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </Card>
          <Card bodyClass="p-0">
            <div className="h-62 w-full">
              <img
                src={post1Img.src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="mb-4 flex justify-between">
                <div>
                  <h5 className="card-title text-slate-900">
                    <Link href="#">Lorem ipsum</Link>
                  </h5>
                </div>
                <Link href="#">
                  <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-400">
                    <Icon
                      icon="heroicons-outline:calendar"
                      className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-400"
                    />
                    10/02/2021
                  </span>
                </Link>
              </div>

              <div className="card-text mt-4 dark:text-slate-300">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="mt-4 space-x-4 rtl:space-x-reverse">
                  <Link href="#" className="btn-link">
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </Card>
          <Card bodyClass="p-0">
            <div className="mb-6 h-62 w-full">
              <img
                src={post1Img.src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="px-6 pb-6">
              <div className="mb-4 flex justify-between">
                <div>
                  <h5 className="card-title text-slate-900">
                    <Link href="#">Lorem ipsum</Link>
                  </h5>
                </div>
                <Link href="#">
                  <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-400">
                    <Icon
                      icon="heroicons-outline:calendar"
                      className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-400"
                    />
                    10/02/2021
                  </span>
                </Link>
              </div>

              <div className="card-text mt-4 dark:text-slate-300">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="mt-4 space-x-4 rtl:space-x-reverse">
                  <Link href="#" className="btn-link">
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </Card>
          <Card bodyClass="p-0">
            <div className="h-62 w-full">
              <img
                src={post1Img.src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="mb-4 flex justify-between">
                <div>
                  <h5 className="card-title text-slate-900">
                    <Link href="#">Lorem ipsum</Link>
                  </h5>
                </div>
                <Link href="#">
                  <span className="inline-flex text-sm leading-5 font-normal text-slate-500 dark:text-slate-400">
                    <Icon
                      icon="heroicons-outline:calendar"
                      className="text-lg text-slate-400 ltr:mr-2 rtl:ml-2 dark:text-slate-400"
                    />
                    10/02/2021
                  </span>
                </Link>
              </div>

              <div className="card-text mt-4 dark:text-slate-300">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <div className="mt-4 space-x-4 rtl:space-x-reverse">
                  <Link href="#" className="btn-link">
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
