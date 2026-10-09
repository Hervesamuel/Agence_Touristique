// Formate le compteur de la cloche de notifications
// 0 -> rien, 1 à 9 -> nombre exact, 10 à 19 -> "+9", 20 et plus -> "+20", "+30", etc.
export const formaterBadge = (nombre) => {
  const n = Number(nombre) || 0;
  if (n <= 0) return "";
  if (n <= 9) return String(n);
  if (n < 20) return "+9";
  return `+${Math.floor(n / 10) * 10}`;
};