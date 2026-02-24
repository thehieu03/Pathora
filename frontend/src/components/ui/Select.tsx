"use client";

import React, { Fragment } from "react";
import Icon from "@/components/ui/Icon";

type SelectProps = {
  label?: string;
  placeholder?: string;
  classLabel?: string;
  className?: string;
  classGroup?: string;
  register?: any;
  name?: string;
  readonly?: boolean;
  value?: string;
  error?: { message?: string };
  icon?: string;
  disabled?: boolean;
  id?: string;
  horizontal?: boolean;
  validate?: string;
  msgTooltip?: boolean;
  description?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options?: any[];
  defaultValue?: string;
  size?: number;
  [key: string]: any;
};

const Select = ({
  label,
  placeholder = "Select Option",
  classLabel = "form-label",
  className = "",
  classGroup = "",
  register,
  name,
  readonly,
  value,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  msgTooltip,
  description,
  onChange,
  onBlur,
  options,
  defaultValue,
  size,
  ...rest
}: SelectProps) => {
  const safeOptions = options || Array(3).fill("option");

  return (
    <div
      className={`fromGroup ${error ? "has-error" : ""} ${
        horizontal ? "flex" : ""
      } ${validate ? "is-valid" : ""} `}
    >
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel} ${
            horizontal ? "mr-6 w-[60px] flex-0 break-words md:w-[100px]" : ""
          }`}
        >
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        <select
          onChange={onChange}
          onBlur={onBlur}
          {...(register && name ? register(name) : {})}
          {...rest}
          name={name}
          className={`${
            error ? "has-error" : " "
          } form-control appearance-none py-2 ${className} `}
          disabled={disabled}
          id={id}
          value={value}
          size={size}
          defaultValue={defaultValue}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {safeOptions.map((option, i) => (
            <Fragment key={i}>
              {typeof option === "object" &&
              option !== null &&
              "value" in option &&
              "label" in option ? (
                <option value={option.value}>{option.label}</option>
              ) : (
                <option value={option}>{option}</option>
              )}
            </Fragment>
          ))}
        </select>

        {/* icon */}
        <div className="absolute top-1/2 flex -translate-y-1/2 space-x-1 text-xl ltr:right-[14px] rtl:left-[14px] rtl:space-x-reverse">
          <span className="pointer-events-none relative -right-2 inline-block text-slate-900 dark:text-slate-300">
            <Icon icon="heroicons:chevron-down" />
          </span>
          {error && (
            <span className="text-danger-500">
              <Icon icon="heroicons-outline:information-circle" />
            </span>
          )}
          {validate && (
            <span className="text-success-500">
              <Icon icon="bi:check-lg" />
            </span>
          )}
        </div>
      </div>
      {/* error and success message*/}
      {error && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? "bg-danger-500 inline-block rounded-sm px-2 py-1 text-[10px] text-white"
              : "text-danger-500 block text-sm"
          }`}
        >
          {error.message}
        </div>
      )}
      {/* validated and success message*/}
      {validate && (
        <div
          className={`mt-2 ${
            msgTooltip
              ? "bg-success-500 inline-block rounded-sm px-2 py-1 text-[10px] text-white"
              : "text-success-500 block text-sm"
          }`}
        >
          {validate}
        </div>
      )}
      {/* only description */}
      {description && <span className="input-description">{description}</span>}
    </div>
  );
};

export default Select;
