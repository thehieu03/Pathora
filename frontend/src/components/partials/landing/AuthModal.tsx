"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Button, Icon } from "@/components/ui";

const GOOGLE_ICON =
  "https://www.figma.com/api/mcp/asset/6af47520-666a-4e1d-bb47-97db509f8848";

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
  dialogRef,
}: {
  children: React.ReactNode;
  onClose: () => void;
  ariaLabel: string;
  dialogRef?: React.RefObject<HTMLDivElement | null>;
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center">
    <button
      type="button"
      className="absolute inset-0 bg-[#333]/80"
      onClick={onClose}
      aria-label="Close modal"
    />
    <div
      ref={dialogRef}
      className="relative bg-white rounded-3xl px-6 sm:px-10 py-8 shadow-[0px_4px_20px_0px_rgba(255,255,255,0.25)] w-[calc(100%-32px)] max-w-112 max-h-[90vh] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
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
      className="font-semibold text-base sm:text-lg text-[#333]/60"
    >
      {label}
    </label>
    <div className="relative">
      <input
        id={id ?? name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-[#333]/20 rounded-lg px-6 py-3.5 text-base text-[#333] placeholder:text-[#333]/50 focus:outline-none focus:border-landing-accent focus-visible:ring-2 focus-visible:ring-landing-accent/40 transition-colors ${
          trailing ? "pr-12" : ""
        }`}
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
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with auth API
    console.log("Sign Up:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[#333] font-bold text-2xl sm:text-[32px] leading-normal">
          Create Account
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-[#333]/60 hover:text-[#333] transition-colors"
          aria-label="Close"
        >
          <Icon icon="heroicons-outline:x-mark" className="w-6 h-6" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5 w-full">
        <InputField
          id="signup-name"
          label="Name and Surname"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your name and surname"
        />
        <InputField
          id="signup-email"
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email address"
        />
        <InputField
          id="signup-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333]/40 hover:text-[#333]/70 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                icon={
                  showPassword
                    ? "heroicons-outline:eye"
                    : "heroicons-outline:eye-slash"
                }
                className="w-6 h-6"
              />
            </button>
          }
        />

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4.5 h-4.5 rounded border border-[#333]/20 accent-landing-accent shrink-0"
          />
          <span className="text-sm text-[#333]/60 leading-normal">
            I agree with{" "}
            <a href="/terms" className="text-landing-accent hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-landing-accent hover:underline">
              Privacy
            </a>
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 items-center w-full">
        <Button
          type="submit"
          text="Sign Up"
          className="w-full bg-landing-accent text-white font-semibold text-lg sm:text-xl rounded-full px-6 py-2.5 text-center hover:bg-landing-accent-hover transition-colors"
        />
        <span className="text-[#333]/40 text-base text-center">or</span>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 border border-[#333]/20 rounded-full px-6 py-2.5 hover:bg-gray-50 transition-colors"
        >
          <Image src={GOOGLE_ICON} alt="Google" width={24} height={24} />
          <span className="font-semibold text-base sm:text-lg text-[#333]/40">
            Sign Up with Google
          </span>
        </button>
      </div>

      {/* Footer */}
      <p className="text-base text-[#333] text-center">
        Already have an account?{" "}
        <button
          type="button"
          className="font-semibold text-landing-accent hover:underline"
          onClick={goToLogin}
        >
          Log In
        </button>
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
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with auth API
    console.log("Login:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[#333] font-bold text-2xl sm:text-[32px] leading-normal">
          Login
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-[#333]/60 hover:text-[#333] transition-colors"
          aria-label="Close"
        >
          <Icon icon="heroicons-outline:x-mark" className="w-6 h-6" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5 w-full">
        <InputField
          id="login-email"
          label="Email Address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email address"
        />
        <div className="flex flex-col gap-1">
          <InputField
            id="login-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333]/40 hover:text-[#333]/70 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon
                  icon={
                    showPassword
                      ? "heroicons-outline:eye"
                      : "heroicons-outline:eye-slash"
                  }
                  className="w-6 h-6"
                />
              </button>
            }
          />
          <button
            type="button"
            onClick={goToForgot}
            className="self-end text-sm text-[#333]/60 hover:text-[#333] transition-colors mt-1"
          >
            Forgot your password?
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 items-center w-full">
        <Button
          type="submit"
          text="Sign In"
          className="w-full bg-landing-accent text-white font-semibold text-lg sm:text-xl rounded-full px-6 py-2.5 text-center hover:bg-landing-accent-hover transition-colors"
        />
        <span className="text-[#333]/40 text-base text-center">or</span>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2.5 border border-[#333]/20 rounded-full px-6 py-2.5 hover:bg-gray-50 transition-colors"
        >
          <Image src={GOOGLE_ICON} alt="Google" width={24} height={24} />
          <span className="font-semibold text-base sm:text-lg text-[#333]/40">
            Sign In with Google
          </span>
        </button>
      </div>

      {/* Footer */}
      <p className="text-base text-[#333] text-center">
        {"Don't have an account ? "}
        <button
          type="button"
          className="font-semibold text-landing-accent hover:underline"
          onClick={goToSignUp}
        >
          Sign Up
        </button>
      </p>
    </form>
  );
};

/* ── Forgot Password View ──────────────────────────────────── */
const ForgotPasswordView = ({ goToLogin }: { goToLogin: () => void }) => {
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
          Check your email
        </h2>
        <p className="text-[#333]/60 text-base leading-relaxed">
          We sent a password reset link to{" "}
          <span className="font-semibold text-[#333]">{email}</span>
        </p>
        <button
          type="button"
          onClick={goToLogin}
          className="flex items-center gap-2 text-[#333]/60 hover:text-[#333] transition-colors text-sm"
        >
          <Icon icon="heroicons-outline:arrow-left" className="w-4 h-4" />
          Back to Login
        </button>
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
        Forgot Password
      </h2>
      <p className="text-[#333]/60 text-base text-center leading-relaxed -mt-2">
        {"No worries, we'll send you reset instructions."}
      </p>

      {/* Email field */}
      <div className="w-full">
        <InputField
          id="forgot-email"
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
        />
      </div>

      <Button
        type="submit"
        text="Reset Password"
        className="w-full bg-landing-accent text-white font-semibold text-lg sm:text-xl rounded-full px-6 py-2.5 text-center hover:bg-landing-accent-hover transition-colors"
      />

      <button
        type="button"
        onClick={goToLogin}
        className="flex items-center gap-2 text-[#333]/60 hover:text-[#333] transition-colors text-sm"
      >
        <Icon icon="heroicons-outline:arrow-left" className="w-4 h-4" />
        Back to Login
      </button>
    </form>
  );
};

/* ── AuthModal (orchestrator) ──────────────────────────────── */
export const AuthModal = ({
  open,
  onClose,
  initialView = "signup",
}: AuthModalProps) => {
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
    signup: "Create Account",
    login: "Login",
    forgot: "Forgot Password",
  };

  return (
    <ModalShell
      onClose={handleClose}
      ariaLabel={ariaLabels[view]}
      dialogRef={dialogRef}
    >
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
