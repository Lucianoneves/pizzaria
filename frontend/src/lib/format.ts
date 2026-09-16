export function formatPrice(value: number) {
    const amount = Number(value);

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number.isFinite(amount) ? amount : 0);
}