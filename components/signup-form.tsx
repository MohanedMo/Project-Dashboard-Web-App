"use client";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from '@tanstack/react-query'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "./ui/field";
import { login, setLoading } from '@/stores/slices/developerSlice'
import { useAppDispatch } from '@/stores/hook'
import { setAuthToken } from '@/lib/auth'
import { useState } from "react";
import { useRouter } from "next/navigation";

 
export interface SignForm {
  name: string;
  email: string;
  role: "DEVELOPER" | "MANAGER" | "ADMIN";
  password: string;
  confirmPassword: string;
}

const formSchema = z
  .object({
    name:z.string().min(2, "Name is very short").max(50),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    role: z.enum(["DEVELOPER", "MANAGER", "ADMIN"], {
      message: "Please select a valid role.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });


export default function SignupForm() {
  const [apiError, setApiError] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "DEVELOPER" as const,
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SignForm) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      return result;
    },
    onMutate: () => {
      setApiError("");
      dispatch(setLoading(true));
    },
    onSuccess: (result) => {
      setAuthToken(result.token);
      dispatch(
        login({
          id: result.developer.id,
          name: result.developer.name,
          email: result.developer.email,
          role: result.developer.role,
          token: result.token,
        })
      );
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      setApiError(error.message);
      dispatch(setLoading(false));
    },
  });

  const onSubmit = (data: SignForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {apiError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="DEVELOPER">Developer</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button onClick={handleSubmit(onSubmit)} className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating account..." : "Register"}
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account? <Link href="/login">Sign in</Link>
            </FieldDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
