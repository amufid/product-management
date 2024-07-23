import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
   return (
      <div className="flex flex-col space-y-3 min-h-screen border px-5">
         <div className="my-auto">
            <div className="flex flex-col space-y-7 w-[600px]">
               <Skeleton className="h-12 w-[20%]" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <div className="flex flex-row space-x-2 justify-end">
                  <Skeleton className="h-12 w-[100px]" />
                  <Skeleton className="h-12 w-[100px]" />
               </div>
            </div>
         </div>
      </div>
   )
}
