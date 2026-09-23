export function formatPrice(price: number) {
  const amount = Number(price);

  return Number.isFinite(amount)
    ? amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "R$ 0,00";
}
