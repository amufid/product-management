'use client'

import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Tabs,
   TabsContent,
   TabsList,
   TabsTrigger,
} from "@/components/ui/tabs";
import FormRegister from './register'
import FormLogin from './login'

export default function AuthPage() {
   return (
      <div className='flex min-h-screen justify-center'>
         <div className='flex justify-center items-center flex-col'>
            <div className="text-center pb-20">
               <h1 className="text-4xl font-semibold">Warehouse X</h1>
            </div>
            <div>
               <Tabs defaultValue="login" className="w-[400px]">
                  <TabsList className="grid w-full grid-cols-2">
                     <TabsTrigger value="login">Login</TabsTrigger>
                     <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  <TabsContent value="login">
                     <Card>
                        <CardHeader>
                           <CardTitle>Login</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <FormLogin />
                        </CardContent>
                     </Card>
                  </TabsContent>
                  <TabsContent value="register">
                     <Card>
                        <CardHeader>
                           <CardTitle>Register</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <FormRegister />
                        </CardContent>
                     </Card>
                  </TabsContent>
               </Tabs>
            </div>
         </div>
      </div >
   )
}
