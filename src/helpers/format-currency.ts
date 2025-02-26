export function formattedKHR(number: number) {
  return number
    .toFixed(0) // Ensure two decimal places
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
