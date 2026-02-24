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
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterRequest } from "@/services/authService";

const schema = yup.object({
  username: yup.string().required("Name is Required"),
  email: yup.string().email("Invalid email").required("Email is Required"),
  password: yup
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(20, "Password shouldn't be more than 20 characters")
    .required("Please enter password"),
});

const RegForm = () => {
  const { register: registerUser } = useAuth();
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
      await registerUser(data as RegisterRequest);
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
        label="name"
        type="text"
        placeholder=" Enter your name"
        register={register}
        error={errors.username}
        className="h-[48px]"
      />
      <Textinput
        name="email"
        label="email"
        type="email"
        placeholder=" Enter your email"
        register={register}
        error={errors.email}
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="passwrod"
        type="password"
        placeholder=" Enter your password"
        register={register}
        error={errors.password}
        className="h-[48px]"
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
