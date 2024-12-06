export type TObjekPajakModel = {
  kode_objek_pajak: string;
  objek_pajak: string;
  tarif_npwp: number;
  tarif_non_npwp: number;
};

export function toObjekPajakResponse(data: TObjekPajakModel) {
  return {
    kode_objek_pajak: data.kode_objek_pajak,
    objek_pajak: data.objek_pajak,
    tarif_npwp: data.tarif_npwp,
    tarif_non_npwp: data.tarif_non_npwp,
  };
}
