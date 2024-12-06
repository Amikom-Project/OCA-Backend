export type TBankModel = {
  kode_bank: number;
  nama_bank: string;
};

export function toBankResponse(data: TBankModel) {
  return {
    kode_bank: data.kode_bank,
    nama_bank: data.nama_bank,
  };
}
