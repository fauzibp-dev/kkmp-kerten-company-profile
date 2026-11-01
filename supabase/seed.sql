-- Source-backed starter content. Idempotent; administrator edits are not overwritten.
insert into public.site_content(id,payload) values('main','{
"hero_eyebrow":"KOPERASI KELURAHAN MERAH PUTIH · KERTEN, SURAKARTA",
"hero_title":"Gerak Bersama,\nTumbuh Bersama.",
"hero_subtitle":"Koperasi Kelurahan Merah Putih Kerten — menghubungkan kebutuhan sehari-hari, potensi lokal, dan semangat gotong royong.",
"about_title":"Ekonomi lokal,\ndikelola bersama.",
"about_body":"Koperasi Kelurahan Merah Putih Kerten merupakan koperasi yang beralamat di Jalan Ahmad Yani Nomor 377, Kelurahan Kerten, Kecamatan Laweyan, Kota Surakarta, Jawa Tengah. Kegiatan usaha mikro tercatat berjalan sejak Juni 2025 pada lampiran Nomor Induk Berusaha.",
"about_secondary":"Identitas badan hukum, NIB, alamat, dan ruang lingkup bidang usaha ditampilkan berdasarkan dokumen resmi yang tersedia. Narasi dan dokumentasi dapat diperbarui oleh pengelola melalui panel admin.",
"legal_nib":"2507250093543","legal_entity":"AHU-0013109.AH.01.29.TAHUN 2025","legal_date":"30 Mei 2025","nib_date":"25 Juli 2025","business_start":"Juni 2025","scale_label":"Usaha Mikro",
"contact_phone":"08122572106","contact_email":"kopkel.kerten@gmail.com","contact_address":"Jl. Ahmad Yani No. 377, Kerten, Laweyan, Kota Surakarta, Jawa Tengah 57143",
"hero_image_url":"","about_image_url":"","operations_image_url":""
}'::jsonb) on conflict(id) do nothing;
insert into public.business_units(name,category,kbli_code,description,status_label,risk_label,sort_order,is_published) values
('Sembako & kebutuhan pokok','Kebutuhan harian','47112','Perdagangan eceran berbagai macam barang yang utamanya makanan, minuman atau tembakau bukan di minimarket/supermarket/hypermarket (tradisional).','NIB terbit · usaha mikro tercatat berjalan sejak Juni 2025','Risiko rendah',1,true),
('Gas LPG','Distribusi','47772','Perdagangan eceran gas elpiji.','NIB dan Sertifikat Standar terbit','Menengah rendah',2,true),
('Agen kurir','Layanan','53202','Aktivitas agen kurir sebagai kegiatan pendukung.','NIB dan Sertifikat Standar terbit','Menengah rendah',3,true),
('Jasa pembayaran','Pembayaran','66411','Penyedia jasa pembayaran (PJP) tercantum dalam lampiran NIB. Dokumen menyebut izin tidak diterbitkan melalui OSS.','Izin tidak diterbitkan melalui OSS pada dokumen','Risiko tinggi',4,true),
('Simpan pinjam koperasi primer','Keuangan','64142','Unit Simpan Pinjam Koperasi Primer tercantum dalam lampiran NIB. Dokumen menyebut izin belum terbit dan persyaratan perlu dipenuhi sebelum beroperasi.','Izin belum terbit pada dokumen','Risiko tinggi',5,true)
on conflict(kbli_code) do nothing;
insert into public.timeline_items(date_label,title,description,sort_order,is_published) values
('30 MEI 2025','Badan hukum koperasi','Nomor badan hukum AHU-0013109.AH.01.29.TAHUN 2025 tercantum dalam dokumen koperasi.',1,true),
('JUNI 2025','Kegiatan usaha mikro berjalan','Lampiran NIB mencatat kegiatan usaha mikro berjalan sejak Juni 2025.',2,true),
('25 JULI 2025','NIB diterbitkan','Nomor Induk Berusaha 2507250093543 diterbitkan untuk Koperasi Kelurahan Merah Putih Kerten.',3,true),
('2026','Aktivitas operasional terdokumentasi','Dokumentasi foto yang tersedia menunjukkan kegiatan pengelolaan stok, pengemasan, dan aktivitas layanan koperasi.',4,true)
on conflict(date_label,title) do nothing;
