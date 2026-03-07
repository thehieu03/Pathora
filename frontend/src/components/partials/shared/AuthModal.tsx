"use client";
import Button from "@/components/ui/Button";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button, Icon } from "@/components/ui";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/store/api/auth/authApiSlice";

const GOOGLE_LOGIN_URL = `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/auth/google-login`;

type AuthView = "signup" | "login" | "forgot";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  /** Which view to show when opened. Defaults to "signup". */
  initialView?: AuthView;
};

/* ── Shared modal shell ────────────────────────────────────── */
const ModalShell = ({
  children,
  onClose,
  ariaLabel,
  closeLabel,
  dialogRef,
}: {
  children: React.ReactNode;
  onClose: () => void;
  ariaLabel: string;
  closeLabel: string;
  dialogRef?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div className="fixed inset-0 z-200 flex items-center justify-center">
    <Button
      type="button"
      className="absolute inset-0 bg-[#333]/80"
      onClick={onClose}
      aria-label={closeLabel}
    />
    <div
      ref={dialogRef}
      className="relative bg-white rounded-3xl px-6 sm:px-10 py-8 shadow-[0px_4px_20px_0px_rgba(255,255,255,0.25)] w-[calc(100%-32px)] max-w-md max-h-[90vh] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}>
      {children}
    </div>
  </div>
);

/* ── Shared input field ────────────────────────────────────── */
const InputField = ({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  trailing,
}: {
  id?: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  trailing?: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2.5">
    <label
      htmlFor={id ?? name}
      className="font-semibold text-base sm:text-lg text-[#333]/60">
      {label}
    </label>
    <div className="relative">
      <TextInput
        id={id ?? name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`!bg-white !border-[#333]/20 !rounded-lg !px-6 !py-3.5 !text-base !text-[#333] placeholder:!text-[#333]/50 focus:!border-landing-accent focus-visible:!ring-landing-accent/40 transition-colors ${trailing ? "!pr-12" : ""}`}
      />
      {trailing}
    </div>
  </div>
);

/* ── Sign Up View ──────────────────────────────────────────── */
const SignUpView = ({
  onClose,
  goToLogin,
}: {
  onClose: () => void;
  goToLogin: () => void;
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error(t("landing.auth.mustAgreeToTerms"));
      return;
    }

    try {
      await register({
        username: form.username,
        fullName: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();

      toast.success(t("landing.auth.registrationSuccess"));
      goToLogin();
    } catch (err: unknown) {
      // Error is handled by RTK Query / middleware generally,
      // but specific form errors could be shown here
      console.error(err);
      toast.error(t("landing.auth.registrationFailed"));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[#333] font-bold text-2xl sm:text-[32px] leading-normal">
          {t("landing.auth.createAccount")}
        </h2>
        <Button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-[#333]/60 hover:text-[#333] transition-colors"
          aria-label={t("landing.auth.close")}>
          <Icon icon="heroicons-outline:x-mark" className="w-6 h-6" />
        </Button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5 w-full">
        <InputField
          id="signup-username"
          label={t("landing.auth.username")}
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder={t("landing.auth.enterUsername")}
        />
        <InputField
          id="signup-name"
          label={t("landing.auth.nameAndSurname")}
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder={t("landing.auth.enterNameAndSurname")}
        />
        <InputField
          id="signup-email"
          label={t("landing.auth.emailAddress")}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t("landing.auth.enterEmailAddress")}
        />
        <InputField
          id="signup-password"
          label={t("landing.auth.password")}
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder={t("landing.auth.enterPassword")}
          trailing={
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333]/40 hover:text-[#333]/70 transition-colors"
              aria-label={
                showPassword
                  ? t("landing.auth.hidePassword")
                  : t("landing.auth.showPassword")
              }>
              <Icon
                icon={
                  showPassword
                    ? "heroicons-outline:eye"
                    : "heroicons-outline:eye-slash"
                }
                className="w-6 h-6"
              />
            </Button>
          }
        />

        {/* Terms */}
        <Checkbox
          value={agreed}
          onChange={() => setAgreed(!agreed)}
          activeClass="!bg-landing-accent !ring-landing-accent !border-landing-accent"
          label={}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 items-center w-full">
        <Button
          type="submit"
          disabled={isLoading}
          icon={isLoading ? "heroicons-outline:arrow-path" : undefined}
          iconClass={isLoading ? "animate-spin" : undefined}
          text={isLoading ? t("common.processing") : t("common.signUp")}
          className="w-full bg-landing-accent text-white font-semibold text-lg sm:text-xl rounded-full px-6 py-2.5 text-center hover:bg-landing-accent-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        />
        <span className="text-[#333]/40 text-base text-center">
          {t("landing.auth.or")}
        </span>
        <Button
          type="button"
          onClick={() => { window.location.href = GOOGLE_LOGIN_URL; }}
          className="w-full flex items-center justify-center gap-2.5 border border-[#333]/20 rounded-full px-6 py-2.5 hover:bg-gray-50 transition-colors">
          <FcGoogle className="w-6 h-6" aria-hidden="true" />
          <span className="font-semibold text-base sm:text-lg text-[#333]/40">
            {t("landing.auth.signUpWithGoogle")}
          </span>
        </Button>
      </div>

      {/* Footer */}
      <p className="text-base text-[#333] text-center">
        {t("landing.auth.alreadyHaveAccount")}{" "}
        <Button
          type="button"
          className="font-semibold text-landing-accent hover:underline"
          onClick={goToLogin}>
          {t("landing.auth.logIn")}
        </Button>
      </p>
    </form>
  );
};

/* ── Login View ────────────────────────────────────────────── */
const LoginView = ({
  onClose,
  goToSignUp,
  goToForgot,
}: {
  onClose: () => void;
  goToSignUp: () => void;
  goToForgot: () => void;
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email: form.email, password: form.password }).unwrap();
      toast.success(t("landing.auth.loginSuccess"));
      onClose();
    } catch {
      // Global error toast is handled by apiSlice / middleware
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[#333] font-bold text-2xl sm:text-[32px] leading-normal">
          {t("landing.auth.login")}
        </h2>
        <Button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-[#333]/60 hover:text-[#333] transition-colors"
          aria-label={t("landing.auth.close")}>
          <Icon icon="heroicons-outline:x-mark" className="w-6 h-6" />
        </Button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5 w-full">
        <InputField
          id="login-email"
          label={t("landing.auth.emailAddress")}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t("landing.auth.enterEmailAddress")}
        />
        <div className="flex flex-col gap-1">
          <InputField
            id="login-password"
            label={t("landing.auth.password")}
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("landing.auth.enterPassword")}
            trailing={
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333]/40 hover:text-[#333]/70 transition-colors"
                aria-label={
                  showPassword
                    ? t("landing.auth.hidePassword")
                    : t("landing.auth.showPassword")
                }>
                <Icon
                  icon={
                    showPassword
                      ? "heroicons-outline:eye"
                      : "heroicons-outline:eye-slash"
                  }
                  className="w-6 h-6"
                />
              </Button>
            }
          />
          <Button
            type="button"
            onClick={goToForgot}
            className="self-end text-sm text-[#333]/60 hover:text-[#333] transition-colors mt-1">
            {t("landing.auth.forgotYourPassword")}
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 items-center w-full">
        <Button
          type="submit"
          disabled={isLoading}
          icon={isLoading ? "heroicons-outline:arrow-path" : undefined}
          iconClass={isLoading ? "animate-spin" : undefined}
          text={isLoading ? t("common.processing") : t("common.signIn")}
          className="w-full bg-landing-accent text-white font-semibold text-lg sm:text-xl rounded-full px-6 py-2.5 text-center hover:bg-landing-accent-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        />
        <span className="text-[#333]/40 text-base text-center">
          {t("landing.auth.or")}
        </span>
        <Button
          type="button"
          onClick={() => { window.location.href = GOOGLE_LOGIN_URL; }}
          className="w-full flex items-center justify-center gap-2.5 border border-[#333]/20 rounded-full px-6 py-2.5 hover:bg-gray-50 transition-colors">
          <FcGoogle className="w-6 h-6" aria-hidden="true" />
          <span className="font-semibold text-base sm:text-lg text-[#333]/40">
            {t("landing.auth.signInWithGoogle")}
          </span>
        </Button>
      </div>

      {/* Footer */}
      <p className="text-base text-[#333] text-center">
        {t("landing.auth.dontHaveAccount")}{" "}
        <Button
          type="button"
          className="font-semibold text-landing-accent hover:underline"
          onClick={goToSignUp}>
          {t("common.signUp")}
        </Button>
      </p>
    </form>
  );
};

/* ── Forgot Password View ──────────────────────────────────── */
const ForgotPasswordView = ({ goToLogin }: { goToLogin: () => void }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with auth API
    console.log("Reset password for:", email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col gap-5 items-center text-center">
        {/* Key icon */}
        <div className="w-12 h-12 rounded-full bg-landing-accent/10 flex items-center justify-center">
          <Icon
            icon="heroicons-outline:key"
            className="w-6 h-6 text-landing-accent"
          />
        </div>
        <h2 className="text-[#333] font-bold text-2xl sm:text-[32px] leading-normal">
          {t("landing.auth.checkYourEmail")}
        </h2>
        <p className="text-[#333]/60 text-base leading-relaxed">
          {t("landing.auth.resetLinkSentTo")}{" "}
          <span className="font-semibold text-[#333]">{email}</span>
        </p>
        <Button
          type="button"
          onClick={goToLogin}
          className="flex items-center gap-2 text-[#333]/60 hover:text-[#333] transition-colors text-sm">
          <Icon icon="heroicons-outline:arrow-left" className="w-4 h-4" />
          {t("landing.auth.backToLogin")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
      {/* Key icon */}
      <div className="w-12 h-12 rounded-full bg-landing-accent/10 flex items-center justify-center">
        <Icon
          icon="heroicons-outline:key"
          className="w-6 h-6 text-landing-accent"
        />
      </div>

      <h2 className="text-[#333] font-bold text-2xl sm:text-[32px] leading-normal">
        {t("landing.auth.forgotPassword")}
      </h2>
      <p className="text-[#333]/60 text-base text-center leading-relaxed -mt-2">
        {t("landing.auth.forgotPasswordHelp")}
      </p>

      {/* Email field */}
      <div className="w-full">
        <InputField
          id="forgot-email"
          label={t("landing.auth.emailAddress")}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("landing.auth.enterEmailAddress")}
        />
      </div>

      <Button
        type="submit"
        text={t("landing.auth.resetPassword")}
        className="w-full bg-landing-accent text-white font-semibold text-lg sm:text-xl rounded-full px-6 py-2.5 text-center hover:bg-landing-accent-hover transition-colors"
      />

      <Button
        type="button"
        onClick={goToLogin}
        className="flex items-center gap-2 text-[#333]/60 hover:text-[#333] transition-colors text-sm">
        <Icon icon="heroicons-outline:arrow-left" className="w-4 h-4" />
        {t("landing.auth.backToLogin")}
      </Button>
    </form>
  );
};

/* ── AuthModal (orchestrator) ──────────────────────────────── */
export const AuthModal = ({
  open,
  onClose,
  initialView = "signup",
}: AuthModalProps) => {
  const { t } = useTranslation();
  const [view, setView] = useState<AuthView>(initialView);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const selectors =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(selectors),
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusables.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  const ariaLabels: Record<AuthView, string> = {
    signup: t("landing.auth.createAccount"),
    login: t("landing.auth.login"),
    forgot: t("landing.auth.forgotPassword"),
  };

  return (
    <ModalShell
      onClose={handleClose}
      ariaLabel={ariaLabels[view]}
      closeLabel={t("landing.auth.closeModal")}
      dialogRef={dialogRef}>
      {view === "signup" && (
        <SignUpView onClose={handleClose} goToLogin={() => setView("login")} />
      )}
      {view === "login" && (
        <LoginView
          onClose={handleClose}
          goToSignUp={() => setView("signup")}
          goToForgot={() => setView("forgot")}
        />
      )}
      {view === "forgot" && (
        <ForgotPasswordView goToLogin={() => setView("login")} />
      )}
    </ModalShell>
  );
};
