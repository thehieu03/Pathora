import React from "react";
import useMenuTranslation from "@/hooks/useMenuTranslation";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HorizentalMenu = () => {
  const { topMenu } = useMenuTranslation();
  const pathname = usePathname();
  return (
    <div className="main-menu">
      <ul>
        {topMenu?.map((item, i) => (
          <li
            key={i}
            className={
              item.child
                ? "menu-item-has-children"
                : item.megamenu
                  ? "menu-item-has-children has-megamenu"
                  : ""
            }
          >
            {/* Single menu*/}
            {!item.child && !item.megamenu && (
              <Link href={item.link || "#"}>
                <div className="flex flex-1 items-center space-x-[6px] rtl:space-x-reverse">
                  <span className="icon-box">
                    <Icon icon={item.icon || ""} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
              </Link>
            )}
            {/* has dropdown*/}
            {(item.child || item.megamenu) && (
              <a href="#">
                <div className="flex flex-1 items-center space-x-[6px] rtl:space-x-reverse">
                  <span className="icon-box">
                    <Icon icon={item.icon || ""} />
                  </span>
                  <div className="text-box">{item.title}</div>
                </div>
                <div className="relative top-1 flex-none text-sm leading-none ltr:ml-3 rtl:mr-3">
                  <Icon icon="heroicons-outline:chevron-down" />
                </div>
              </a>
            )}
            {/* Dropdown menu*/}
            {item.child && (
              <ul className="sub-menu">
                {item.child.map((childitem, index) => (
                  <li key={index}>
                    {childitem.isExternal || childitem.isBlank ? (
                      <a
                        href={childitem.childlink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-start space-x-2 rtl:space-x-reverse">
                          <Icon
                            icon={childitem.childicon || ""}
                            className="text-base leading-none"
                          />
                          <span className="leading-none">
                            {childitem.childtitle}
                          </span>
                          <Icon
                            icon="heroicons:arrow-top-right-on-square"
                            className="h-4 w-4"
                          />
                        </div>
                      </a>
                    ) : (
                      <Link href={childitem.childlink || "#"}>
                        <div className="flex items-start space-x-2 rtl:space-x-reverse">
                          <Icon
                            icon={childitem.childicon || ""}
                            className="text-base leading-none"
                          />
                          <span className="leading-none">
                            {childitem.childtitle}
                          </span>
                        </div>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {/* Megamenu*/}
            {item.megamenu && (
              <div className="rt-mega-menu">
                <div className="flex flex-wrap justify-between space-x-8 rtl:space-x-reverse">
                  {item.megamenu.map((m_item, m_i) => (
                    <div key={m_i}>
                      {/* mega menu title*/}
                      <div className="mb-2 flex items-center space-x-1 text-sm font-medium text-slate-900 dark:text-white">
                        {/* <Icon icon={m_item.megamenuicon} /> */}
                        <span> {m_item.megamenutitle}</span>
                      </div>
                      {/* single menu item*/}
                      {m_item.singleMegamenu?.map((ms_item, ms_i) => {
                        const isActive = pathname === ms_item.m_childlink;
                        return (
                          <Link href={ms_item.m_childlink || "#"} key={ms_i}>
                            <div className="flex items-center space-x-2 text-[15px] leading-6 rtl:space-x-reverse">
                              <span
                                className={`inline-block h-[6px] w-[6px] flex-none rounded-full border border-slate-600 dark:border-white ${
                                  isActive ? "bg-slate-900 dark:bg-white" : ""
                                }`}
                              ></span>
                              <span
                                className={`capitalize ${
                                  isActive
                                    ? "font-medium text-slate-900 dark:text-white"
                                    : "text-slate-600 dark:text-slate-300"
                                }`}
                              >
                                {ms_item.m_childtitle}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HorizentalMenu;
