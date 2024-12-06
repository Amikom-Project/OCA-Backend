export type TCountPPh = {
  pph_21_entry: number;
  pph_21_verifikasi: number;
  pph_21_setor: number;
  pph_23_entry: number;
  pph_23_verifikasi: number;
  pph_23_setor: number;
  pph_4_ayat_2_entry: number;
  pph_4_ayat_2_verifikasi: number;
  pph_4_ayat_2_setor: number;
};

export function toCountPPhResponse(data: TCountPPh) {
  return {
    pph_21_entry: data.pph_21_entry,
    pph_21_verifikasi: data.pph_21_verifikasi,
    pph_21_setor: data.pph_21_setor,
    pph_23_entry: data.pph_23_entry,
    pph_23_verifikasi: data.pph_23_verifikasi,
    pph_23_setor: data.pph_23_setor,
    pph_4_ayat_2_entry: data.pph_4_ayat_2_entry,
    pph_4_ayat_2_verifikasi: data.pph_4_ayat_2_verifikasi,
    pph_4_ayat_2_setor: data.pph_4_ayat_2_setor,
  };
}
