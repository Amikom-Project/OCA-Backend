import { z } from 'zod';

export const InventarisasiPajakValidation = z.object({
  uraian_kegiatan: z
    .string({
      required_error: 'Uraian Kegiatan tidak boleh kosong !',
    })
    .max(255, {
      message: 'Uraian Kegiatan tidak bisa lebih dari 255 karakter !',
    }),
  no_pengajuan: z.string().optional(),
  nominal_dpp: z
    .number({
      required_error:
        'Nominal DPP (Dasar Penghasilan Pajak) tidak boleh kosong !',
    })
    .positive(),
  jenis_pajak: z.string({
    required_error: 'Jenis Pajak tidak boleh kosong !',
  }),
  kode_objek_pajak: z.string({
    required_error: 'Objek Pajak tidak boleh kosong !',
  }),
  nominal_pajak: z
    .number({
      required_error: 'Nominal Pajak tidak boleh kosong !',
    })
    .positive(),
  nama_pemotong: z
    .string({
      required_error: 'Nama Pemotong tidak boleh kosong !',
    })
    .max(100, {
      message: 'Nama Pemotong tidak bisa lebih dari 100 karakter !',
    }),
  npwp_pemotong: z
    .string({
      required_error: 'NPWP Pemotong tidak boleh kosong !',
    })
    .min(15, {
      message: 'NPWP Pemotong tidak bisa kurang dari 15 karakter !',
    })
    .max(16, {
      message: 'NPWP Pemotong tidak bisa lebih dari 16 karakter !',
    }),
  file_bukti: z.string({
    required_error: 'File Dokumen Bukti Dokumentasi tidak boleh kosong !',
  }),
  idl: z.string({
    required_error: 'IDL tidak boleh kosong !',
  }),
});
