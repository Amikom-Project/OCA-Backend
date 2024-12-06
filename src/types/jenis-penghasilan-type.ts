export type TJenisPenghasilanModel = {
  kode_jenis_penghasilan: number;
  jenis_penghasilan: string;
};

export function toJenisPenghasilanResponse(data: TJenisPenghasilanModel) {
  return {
    kode_jenis_penghasilan: data.kode_jenis_penghasilan,
    jenis_penghasilan: data.jenis_penghasilan,
  };
}
