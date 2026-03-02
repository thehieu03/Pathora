"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.us";

type TextinputProps = {
  type?: string;
  label?: string;
  placeholder?: string;
  classLabel?: string;
  className?: string;
  classGroup?: string;
  register?: (name: string, options?: Record<string, unknown>) => Record<string, unknown>;
  name?: string;
  readonly?: boolean;
  value?: string;
  error?: { message?: string };
  icon?: string;
  disabled?: boolean;
  id?: string;
  horizontal?: boolean;
  validate?: string;
  isMask?: boolean;
  msgTooltip?: boolean;
  description?: string;
  hasicon?: boolean;
  autocomplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  options?: Record<string, unknown>;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  [key: string]: unknown;
};

const Textinput = ({
  type,
  label,
  placeholder,
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
  isMask,
  msgTooltip,
  description,
  hasicon,
  autocomplete,
  onChange,
  onBlur,
  options,
  onFocus,
  defaultValue,
  ...rest
}: TextinputProps) => {
  const [open, setOpen] = useState(false);
  const inputType = type === "password" && open ? "text" : type;

  const getAutocomplete = () => {
    if (autocomplete) return autocomplete;
    if (type === "email") return "email";
    if (type === "password") return "current-password";
    if (name === "username") return "username";
    return "off";
  };

  const renderInput = () => {
    const inputClasses = `form-control py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400 ${error ? "has-error" : ""} ${className}`;

    if (isMask) {
      return (
        <Cleave
          {...(register && name ? register(name) : {})}
          {...rest}
          name={name}
          placeholder={placeholder}
          options={options}
          className={inputClasses}
          onFocus={onFocus}
          id={id}
          readOnly={readonly}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      );
    }

    return (
      <input
        type={inputType}
        {...(register && name ? register(name) : {})}
        {...rest}
        name={name}
        className={inputClasses}
        placeholder={placeholder}
        readOnly={readonly}
        defaultValue={defaultValue}
        disabled={disabled}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={getAutocomplete()}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    );
  };

  return (
    <div
      className={`fromGroup ${error ? "has-error" : ""} ${
        horizontal ? "flex" : ""
      } ${validate ? "is-valid" : ""}`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`block capitalize ${classLabel} ${
            horizontal ? "mr-6 w-15 flex-0 break-words md:w-25" : ""
          }`}
        >
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        {renderInput()}

        <div className="absolute top-1/2 flex -translate-y-1/2 space-x-1 text-xl ltr:right-3.5 rtl:left-3.5 rtl:space-x-reverse">
          {hasicon && type === "password" && (
            <button
              type="button"
              className="text-secondary-500 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Hide password" : "Show password"}
            >
              <Icon icon={open ? "heroicons-outline:eye" : "heroicons-outline:eye-off"} />
            </button>
          )}

          {error && (
            <span className="text-danger-500" aria-hidden="true">
              <Icon icon="heroicons-outline:information-circle" />
            </span>
          )}
          {validate && (
            <span className="text-success-500" aria-hidden="true">
              <Icon icon="bi:check-lg" />
            </span>
          )}
        </div>
      </div>

      {error && (
        <div
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className={`mt-2 ${
            msgTooltip
              ? "bg-danger-500 inline-block rounded-sm px-2 py-1 text-[10px] text-white"
              : "text-danger-500 block text-sm"
          }`}
        >
          {error.message}
        </div>
      )}
      
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
      
      {description && (
        <span className="input-description">{description}</span>
      )}
    </div>
  );
};

export default Textinput;
