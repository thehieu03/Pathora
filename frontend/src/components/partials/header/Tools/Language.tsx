import { Fragment, useMemo } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { useTranslation } from "react-i18next";

import Usa from "@/assets/images/flags/usa.png";
import Vi from "@/assets/images/flags/vi.png";

const languages = [
  { code: "en", name: "English", image: Usa },
  { code: "vi", name: "Tiếng Việt", image: Vi },
];

const normalizeLanguageCode = (value?: string) =>
  (value || "en").toLowerCase().split("-")[0];

const Language = () => {
  const { i18n } = useTranslation();
  const selected = useMemo(
    () =>
      languages.find(
        (lang) =>
          lang.code ===
          normalizeLanguageCode(i18n.resolvedLanguage || i18n.language),
      ) || languages[0],
    [i18n.language, i18n.resolvedLanguage],
  );

  const handleChange = (lang: (typeof languages)[number]) => {
    i18n.changeLanguage(lang.code);
  };

  return (
    <div>
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative z-22">
          <ListboxButton className="relative flex w-full cursor-pointer items-center space-x-1.5 rtl:space-x-reverse">
            <span className="inline-block h-4 w-4 rounded-full md:h-6 md:w-6">
              <img
                src={selected.image as unknown as string}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            </span>
            <span className="hidden text-sm font-medium text-slate-600 md:block dark:text-slate-300">
              {selected.code.toUpperCase()}
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute top-9.5 mt-1 max-h-60 w-auto min-w-25 overflow-auto rounded-sm border border-slate-200 bg-white md:top-12.5 ltr:right-0 rtl:left-0 dark:border-slate-700 dark:bg-slate-800">
              {languages.map((item, i) => (
                <ListboxOption
                  key={i}
                  value={item}
                  className="group flex w-full cursor-pointer list-none gap-2 border-b border-b-gray-500/10 px-2 py-2 first:rounded-t last:mb-0 last:rounded-b last:border-none data-[focus]:bg-slate-100/50 dark:text-white dark:data-[focus]:bg-slate-700/70"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="flex-none">
                      <span className="inline-block h-4 w-4 rounded-full lg:h-6 lg:w-6">
                        <img
                          src={item.image as unknown as string}
                          alt=""
                          className="relative top-1 h-full w-full rounded-full object-cover"
                        />
                      </span>
                    </span>
                    <span className="flex-1 text-sm capitalize lg:text-base">
                      {item.name}
                    </span>
                  </div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Language;
