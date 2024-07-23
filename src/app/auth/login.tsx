'use client'

import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'

const formSchema = z.object({
   email: z.string().min(5, { message: 'Email must be at least 5 characters.' }),
   password: z.string().min(7, { message: 'Password must be at least 7 characters.' }),
})

type FormSchema = z.infer<typeof formSchema>

export default function AuthPage() {
   const form = useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: '',
         password: ''
      }
   });
   const { register, handleSubmit, control } = form;
   const router = useRouter()

   const onSubmit = async (values: FormSchema) => {
      try {
         const response = await fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
         })
         const data = await response.json()
         Cookies.set('accessToken', data.accessToken)
         toast.success('Login successful')
         router.push('/product')
      } catch (error) {
         console.log(error)
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <FormField
               control={control}
               name='email'
               render={() => (
                  <FormItem>
                     <FormLabel>Email</FormLabel>
                     <FormControl>
                        <Input placeholder='Email' type='email' {...register('email')} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={control}
               name='password'
               render={() => (
                  <FormItem>
                     <FormLabel>Password</FormLabel>
                     <FormControl>
                        <Input placeholder='Password' type='password' {...register('password')} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <Button>Login</Button>
         </form>
      </Form>
   )
}
