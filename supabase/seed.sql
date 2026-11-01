-- Source-backed starter content. Existing admin edits are not overwritten.
insert into public.site_content(id,payload)
values ('main','{
  "hero_eyebrow":"KOPERASI KELURAHAN MERAH PUTIH · KERTEN, SURAKARTA",
  "hero_title":"Gerak bersama.\n<em>Tumbuh bersama.</em>",
  "hero_subtitle":"Dari Kerten, kami merawat semangat gotong royong menjadi gerak ekonomi yang dekat, nyata, dan bertumbuh bersama masyarakat.",
  "about_title":"Satu wadah.\n<em>Banyak kemungkinan.</em>",
  "about_body":"Koperasi Kelurahan Merah Putih Kerten hadir sebagai wadah ekonomi bersama di wilayah Kerten, Kecamatan Laweyan, Kota Surakarta. Berangkat dari kebutuhan masyarakat dan semangat gotong royong, koperasi mengembangkan kegiatan usaha yang dekat dengan kehidupan sehari-hari.",
  "about_secondary":"Berdasarkan dokumen NIB, koperasi beralamat di Jalan Ahmad Yani Nomor 377, Kerten, Kecamatan Laweyan, Kota Surakarta, Jawa Tengah 57143. NIB diterbitkan pada 25 Juli 2025 dan mencatat skala usaha mikro.",
  "contact_phone":"0812 2572 2106",
  "contact_email":"kopkel.kerten@gmail.com",
  "contact_address":"Jl. Ahmad Yani No. 377, Kerten, Laweyan, Kota Surakarta, Jawa Tengah 57143",
  "hero_image_url":"",
  "about_image_url":"",
  "operations_image_url":""
}'::jsonb)
on conflict (id) do nothing;

insert into public.business_units(name,category,kbli_code,description,status_label,risk_label,sort_order,is_published)
values
('Sembako & kebutuhan pokok','Kebutuhan harian','47112','Perdagangan eceran berbagai macam barang yang utamanya makanan, minuman atau tembakau bukan di minimarket/supermarket/hypermarket (tradisional).','NIB terbit · risiko rendah','Risiko rendah',1,true),
('Gas LPG','Distribusi','47772','Perdagangan eceran gas elpiji.','NIB & sertifikat standar terbit','Menengah rendah',2,true),
('Agen kurir','Layanan','53202','Aktivitas agen kurir sebagai kegiatan pendukung.','NIB & sertifikat standar terbit','Menengah rendah',3,true),
('Jasa pembayaran','Pembayaran','66411','Penyedia jasa pembayaran (PJP) sebagaimana tercantum dalam lampiran NIB. Dokumen menyebut izin tidak diterbitkan melalui OSS.','Izin khusus perlu dikonfirmasi','Risiko tinggi',4,true),
('Simpan pinjam','Keuangan','64142','Unit Simpan Pinjam Koperasi Primer. Dokumen NIB mencatat izin belum terbit dan persyaratan perlu dipenuhi sebelum kegiatan operasional.','Izin belum terbit pada dokumen','Risiko tinggi',5,true)
on conflict (kbli_code) do nothing;

insert into public.timeline_items(date_label,title,description,sort_order,is_published)
values
('MEI 2025','Musyawarah pembentukan','Dokumentasi musyawarah khusus pembentukan Koperasi Kelurahan Merah Putih wilayah Kerten.',1,true),
('JUNI 2025','Kegiatan usaha mikro berjalan','Dokumen NIB mencatat kegiatan usaha mikro berjalan sejak Juni 2025.',2,true),
('25 JULI 2025','Nomor Induk Berusaha diterbitkan','NIB 2507250093543 diterbitkan untuk Koperasi Kelurahan Merah Putih Kerten.',3,true),
('2026','Aktivitas dan penguatan layanan','Dokumentasi kegiatan 2026 menunjukkan aktivitas pengelolaan barang, stok, pengemasan, dan koordinasi pengurus.',4,true)
on conflict (date_label,title) do nothing;
