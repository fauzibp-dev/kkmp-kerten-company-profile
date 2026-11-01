# KKMP Kerten — Company Profile

Website profil publik untuk **Koperasi Kelurahan Merah Putih Kerten, Kecamatan Laweyan, Kota Surakarta**. Dibangun sebagai static website tanpa build step, dengan mode presentasi fullscreen dan panel admin berbasis Supabase.

## Pengalaman publik
- Editorial / cinematic one-page profile dengan palet forest green, cream, merah, dan aksen emas.
- Mode Presentasi fullscreen: tombol di header, atau buka `/?present=1`. Navigasi slide memakai tombol panah, Page Up/Down, Space, dan tombol F.
- Bagian identitas, nilai gerak koperasi, bidang usaha, legalitas, linimasa, galeri, pengurus, testimoni, dan kontak.
- Galeri lightbox dengan navigasi foto.
- Responsif untuk desktop, tablet, dan mobile; menghormati `prefers-reduced-motion`.

## Panel admin
Buka `/admin/`. Panel menyediakan:
- Login email/password melalui Supabase Auth; tidak ada pendaftaran publik.
- Edit konten utama dan kontak.
- CRUD bidang usaha, milestone, galeri foto, pengurus, dan testimoni.
- Status draf/tayang untuk konten yang dapat dipublikasikan.
- Upload JPG/PNG/WebP ke Supabase Storage; maksimal 10 MB per foto.
- Pilih foto galeri sebagai sampul website.

## Setup Supabase

1. Buat project Supabase baru di organisasi yang dipilih pemilik koperasi.
2. Buka **SQL Editor**, jalankan `supabase/schema.sql`, lalu jalankan `supabase/seed.sql`.
3. Di **Authentication → Users**, buat akun pengelola pertama (email/password). Matikan sign-up publik bila diaktifkan.
4. Salin UUID akun tersebut, lalu jalankan SQL berikut di SQL Editor:

   ```sql
   insert into public.admin_users(user_id, role, is_active)
   values ('UUID-AKUN-AUTH', 'super_admin', true);
   ```

5. Buka **Project Settings → API**. Salin Project URL dan publishable key (atau legacy anon key) ke `config.js`:

   ```js
   window.KKMP_CONFIG = {
     supabaseUrl: "https://PROJECT_REF.supabase.co",
     supabaseAnonKey: "sb_publishable_...",
     mediaBucket: "kkmp-media"
   };
   ```

6. Tambahkan URL website ke **Authentication → URL Configuration**. Set Site URL ke domain produksi dan Redirect URLs ke `https://DOMAIN/admin/` untuk reset password.
7. Deploy repository ke Vercel sebagai static site. Tidak memerlukan build command; output/root directory adalah repository root.

**Keamanan:** jangan pernah memasukkan `service_role` key ke `config.js` atau file frontend. Akses tulis dibatasi oleh Row Level Security dan `public.is_kkmp_admin()`. Bucket `kkmp-media` bersifat public-read agar foto dapat tampil pada website; upload/update/delete hanya untuk admin aktif.

## Sumber data awal dan batas akurasi

Starter content dirangkum dari dokumen yang tersedia:
- NIB **2507250093543**, diterbitkan 25 Juli 2025; skala usaha mikro; kegiatan usaha tercatat berjalan sejak Juni 2025.
- Alamat pada NIB: Jl. Ahmad Yani No. 377, Kerten, Laweyan, Kota Surakarta, Jawa Tengah 57143.
- Email pada NIB: `kopkel.kerten@gmail.com`.
- Lima kode KBLI pada lampiran NIB: 47112, 47772, 53202, 66411, dan 64142. Status izin untuk PJP dan USP ditulis hati-hati sesuai keterangan pada lampiran, bukan diasumsikan telah beroperasi.
- Nomor badan hukum **AHU-0013109.AH.01.29.TAHUN 2025** tercantum pada laporan koperasi tahun buku 2025.
- Linimasa awal memakai dokumentasi musyawarah Mei 2025, tanggal usaha mikro berjalan pada NIB (Juni 2025), penerbitan NIB (25 Juli 2025), dan dokumentasi aktivitas 2026.

### Perlu konfirmasi sebelum publikasi final
Terdapat perbedaan nomor telepon pada dokumen: NIB mencantumkan **0812 2572 2106**, sedangkan header laporan neraca September 2026 mencantumkan **0831 8711 9099**. Website memakai nomor dari NIB sebagai nilai awal; pastikan nomor publik yang benar melalui admin sebelum video/publikasi final.

Nama pengurus, testimoni, jumlah anggota, angka omzet, dan klaim capaian tidak diisi otomatis karena perlu data terkini dan/atau persetujuan narasumber. Foto dokumentasi asli dapat diunggah melalui **Admin → Galeri Foto** setelah Supabase Storage terhubung.

## Local preview

Karena website static, jalankan melalui static server (contoh VS Code Live Server) dari root repository. Membuka file langsung dengan `file://` tidak disarankan untuk modul JavaScript dan Supabase Auth.
