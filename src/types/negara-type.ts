export type TNegaraModel = {
  kode_negara: string;
  nama_negara: string;
};

export function toNegaraResponse(data: TNegaraModel) {
  return {
    kode_negara: data.kode_negara,
    nama_negara: data.nama_negara,
  };
}
