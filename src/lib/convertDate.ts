function convertDate(inputDate: string) {
   const date = new Date(inputDate);

   // Format date to Indonesian locale
   const formattedDate = date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: '2-digit',
      month: '2-digit',
      day: 'numeric',
   });

   // Format time to Indonesian locale
   const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
   });

   return `${formattedDate}, ${formattedTime}`;
}

export default convertDate;