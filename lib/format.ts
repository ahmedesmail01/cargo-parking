export const fmtCurrency = (n: number) =>
  Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
    n
  );
export const fmtTime = (iso: string) => new Date(iso).toLocaleString();
