
export const formatPricePerHour = (price: number): string => {
  const formatted = price.toLocaleString('vi-VN');
  return `${formatted} đ/giờ`;
};


export const formatCurrency = (amount: number): string => {
  const formatted = amount.toLocaleString('vi-VN');
  return `${formatted} đ`;
};


export const formatTimeSlot = (startHour: number, hours: number): string => {
  const endHour = startHour + hours;
  return `${startHour}h - ${endHour}h (${hours} giờ)`;
};

