export function getYears() {
   const currentYear = new Date().getFullYear();
   let year: any = []

   for (let i = 2023; i <= currentYear; i++) {
      year.push(i);
   }
   return year;
}