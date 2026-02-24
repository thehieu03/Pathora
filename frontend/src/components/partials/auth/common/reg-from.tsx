"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";

const schema = yup.object({
  username: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters")
    .required("Please enter password"),
});

const RegForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      console.log("Register data:", data);
      reset();
      router.push("/login");
      toast.success("Registration successful. Please login.");
    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Textinput
        name="username"
        label="Name"
        type="text"
        placeholder="Enter your name…"
        register={register}
        error={errors.username}
        className="h-12"
        autocomplete="username"
      />
      <Textinput
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email…"
        register={register}
        error={errors.email}
        className="h-12"
        autocomplete="email"
        spellCheck={false}
      />
      <Textinput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password…"
        register={register}
        error={errors.password}
        className="h-12"
        autocomplete="new-password"
        hasicon
      />
      <Checkbox
        label="You accept our Terms and Conditions and Privacy Policy"
        value={checked}
        onChange={() => setChecked(!checked)}
      />
      <Button
        type="submit"
        text="Create an account"
        className="btn btn-dark block w-full text-center"
        isLoading={isLoading}
      />
    </form>
  );
};

export default RegForm;
