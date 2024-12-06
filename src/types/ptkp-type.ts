export type TPtkpModel = {
  kode_ptkp: number;
  ptkp: string;
};

export function toPtkpResponse(data: TPtkpModel) {
  return {
    kode_ptkp: data.kode_ptkp,
    ptkp: data.ptkp,
  };
}
