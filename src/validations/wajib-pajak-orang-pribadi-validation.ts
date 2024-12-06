import { z } from 'zod';

const baseSchema = z.object({
  nama: z
    .string({ required_error: 'Nama Lengkap tidak boleh kosong !' })
    .max(100, 'Nama Lengkap tidak bisa lebih dari 100 karakter !'),
  email: z
    .string({ required_error: 'Email tidak boleh kosong !' })
    .email('Format Email tidak valid !'),
  status_pegawai: z.enum(
    [
      'Pegawai Tetap',
      'Pegawai Tidak Tetap',
      'Bukan Pegawai',
      'Dewan Komisaris',
      'Mantan Pegawai',
      'Warga Negara Asing',
    ],
    {
      required_error: 'Status Pegawai tidak boleh kosong !',
    }
  ),
  ptkp: z.string({ required_error: 'PTKP tidak boleh kosong !' }),
  kewarganegaraan: z.enum(['WNI', 'WNA'], {
    required_error: 'Kewarganegaraan tidak boleh kosong !',
  }),
  ada_npwp: z.enum(['Ya', 'Tidak'], {
    required_error: 'Ada NPWP tidak boleh kosong !',
  }),
});

const statusPegawaiSchema = z.discriminatedUnion('status_pegawai', [
  z.object({
    status_pegawai: z.literal('Pegawai Tetap'),
    nip: z
      .string({ required_error: 'NIP tidak boleh kosong !' })
      .min(5, 'NIP tidak bisa kurang dari 5 digit !')
      .max(10, 'NIP tidak bisa lebih dari 10 digit !'),
  }),
  z.object({
    status_pegawai: z.literal('Dewan Komisaris'),
    nip: z
      .string({ required_error: 'NIP tidak boleh kosong !' })
      .min(5, 'NIP tidak bisa kurang dari 5 digit !')
      .max(10, 'NIP tidak bisa lebih dari 10 digit !'),
  }),
  z.object({
    status_pegawai: z.literal('Mantan Pegawai'),
    nip: z
      .string({ required_error: 'NIP tidak boleh kosong !' })
      .min(5, 'NIP tidak bisa kurang dari 5 digit !')
      .max(10, 'NIP tidak bisa lebih dari 10 digit !'),
  }),
  z.object({
    status_pegawai: z.literal('Pegawai Tidak Tetap'),
    nip: z.string().optional(),
  }),
  z.object({
    status_pegawai: z.literal('Bukan Pegawai'),
    nip: z.string().optional(),
  }),
  z.object({
    status_pegawai: z.literal('Warga Negara Asing'),
    nip: z.string().optional(),
  }),
]);

const bankSchema = z.union([
  z.object({
    nama_bank: z.literal('TUNAI'),
    no_rekening: z.string().optional(),
    nama_rekening: z.string().optional(),
    file_foto_bukti_rekening: z.string().optional(),
  }),
  z.object({
    nama_bank: z.string({ required_error: 'Nama Bank tidak boleh kosong !' }),
    no_rekening: z.string({
      required_error: 'No Rekening tidak boleh kosong !',
    }),
    nama_rekening: z
      .string({ required_error: 'Nama Rekening tidak boleh kosong !' })
      .max(100, 'Nama Rekening tidak boleh lebih dari 100 karakter !'),
    file_foto_bukti_rekening: z.string().optional(),
  }),
]);

const npwpSchema = z.discriminatedUnion('ada_npwp', [
  z.object({
    ada_npwp: z.literal('Ya'),
    npwp: z
      .string({ required_error: 'NPWP tidak boleh kosong !' })
      .min(15, { message: 'NPWP tidak boleh kurang dari 15 karakter !' })
      .max(16, { message: 'NPWP tidak boleh lebih dari 16 karakter !' }),
    nama_npwp: z
      .string({ required_error: 'Nama NPWP tidak boleh kosong !' })
      .min(1, { message: 'Nama NPWP tidak boleh kosong !' })
      .max(100, 'Nama NPWP tidak boleh lebih dari 100 karakter !'),
    provinsi_npwp: z.string({
      required_error: 'Provinsi NPWP tidak boleh kosong !',
    }),
    kabupaten_npwp: z.string({
      required_error: 'Kabupaten NPWP tidak boleh kosong !',
    }),
    file_foto_npwp: z.string({
      required_error: 'File Foto NPWP tidak boleh kosong !',
    }),
  }),
  z.object({
    ada_npwp: z.literal('Tidak'),
    npwp: z.string().optional(),
    nama_npwp: z.string().optional(),
    provinsi_npwp: z.string().optional(),
    kabupaten_npwp: z.string().optional(),
    file_foto_npwp: z.string().optional(),
  }),
]);

const kewarganegaraanSchema = z.discriminatedUnion('kewarganegaraan', [
  z.object({
    kewarganegaraan: z.literal('WNI'),
    nik: z
      .string({ required_error: 'NIK tidak boleh kosong !' })
      .length(16, 'NIK harus terdiri dari 16 digit !'),
    nama_ktp: z
      .string({ required_error: 'Nama KTP tidak boleh kosong !' })
      .max(100, 'Nama KTP tidak boleh lebih dari 100 karakter !'),
    file_foto_ktp: z.string({
      required_error: 'File Foto KTP tidak boleh kosong !',
    }),
  }),

  z.object({
    kewarganegaraan: z.literal('WNA'),
    nama_negara: z.string({
      required_error: 'Nama Negara tidak boleh kosong !',
    }),
    no_passport: z
      .string({ required_error: 'No Passport tidak boleh kosong !' })
      .length(16, 'No Passport harus terdiri dari 16 digit !'),
    nama_passport: z
      .string({ required_error: 'Nama Passport tidak boleh kosong !' })
      .max(100, 'Nama Passport tidak boleh lebih dari 100 karakter !'),
    masa_berlaku_passport: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date({
        required_error: 'Masa Berlaku Passport tidak boleh kosong !',
      })
    ),
    file_foto_passport: z.string({
      required_error: 'File Foto Passport tidak boleh kosong !',
    }),
  }),
]);

export const WajibPajakOrangPribadiValidation = baseSchema
  .and(statusPegawaiSchema)
  .and(kewarganegaraanSchema)
  .and(bankSchema)
  .and(npwpSchema);
