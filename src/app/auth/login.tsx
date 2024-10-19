"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";
import { baseURL } from "@/lib/baseUrl";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import MoonLoader from "react-spinners/MoonLoader";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function AuthPage() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { register, handleSubmit, control } = form;
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: FormSchema) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${baseURL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        toast.error("Email atau password salah!");
        return;
      }

      const data = await res.json();

      if (data.accessToken) {
        login({ user: data.username }, data.accessToken);
        toast.success("Login successful");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("Kesalahan server internal!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <p>Email: admin@mail.com, Password: admin123</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={control}
          name="email"
          render={() => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  type="email"
                  {...register("email")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={() => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  {...register("password")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading ? (
          <Button disabled>
            <MoonLoader size={20} />
            <span className="ml-2">Login</span>
          </Button>
        ) : (
          <Button>Login</Button>
        )}
      </form>
    </Form>
  );
}
