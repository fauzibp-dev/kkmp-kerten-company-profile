const fallbackContent = {
  hero_eyebrow: "KOPERASI KELURAHAN MERAH PUTIH · KERTEN, SURAKARTA",
  hero_title: "Gerak bersama.\n<em>Tumbuh bersama.</em>",
  hero_subtitle: "Dari Kerten, kami merawat semangat gotong royong menjadi gerak ekonomi yang dekat, nyata, dan bertumbuh bersama masyarakat.",
  about_title: "Satu wadah.\n<em>Banyak kemungkinan.</em>",
  about_body: "Koperasi Kelurahan Merah Putih Kerten hadir sebagai wadah ekonomi bersama di wilayah Kerten, Kecamatan Laweyan, Kota Surakarta. Berangkat dari kebutuhan masyarakat dan semangat gotong royong, koperasi mengembangkan kegiatan usaha yang dekat dengan kehidupan sehari-hari.",
  about_secondary: "Berdasarkan dokumen NIB, koperasi beralamat di Jalan Ahmad Yani Nomor 377, Kerten, Kecamatan Laweyan, Kota Surakarta, Jawa Tengah 57143. NIB diterbitkan pada 25 Juli 2025 dan mencatat skala usaha mikro.",
  contact_phone: "0812 2572 2106",
  contact_email: "kopkel.kerten@gmail.com",
  contact_address: "Jl. Ahmad Yani No. 377, Kerten, Laweyan, Kota Surakarta, Jawa Tengah 57143",
  hero_image_url: "",
  about_image_url: "",
  operations_image_url: ""
};
const fallbackUnits = [
  {name:"Sembako & kebutuhan pokok",description:"Perdagangan eceran berbagai macam barang yang utamanya makanan, minuman atau tembakau bukan di minimarket/supermarket/hypermarket (tradisional).",status_label:"NIB terbit · risiko rendah",risk_label:"Risiko rendah",kbli_code:"47112",category:"Kebutuhan harian",sort_order:1},
  {name:"Gas LPG",description:"Perdagangan eceran gas elpiji.",status_label:"NIB & sertifikat standar terbit",risk_label:"Menengah rendah",kbli_code:"47772",category:"Distribusi",sort_order:2},
  {name:"Agen kurir",description:"Aktivitas agen kurir sebagai kegiatan pendukung.",status_label:"NIB & sertifikat standar terbit",risk_label:"Menengah rendah",kbli_code:"53202",category:"Layanan",sort_order:3},
  {name:"Jasa pembayaran",description:"Penyedia jasa pembayaran sebagaimana tercantum dalam lampiran NIB. Perizinan khusus tidak diterbitkan melalui OSS pada dokumen yang tersedia.",status_label:"Izin khusus perlu dikonfirmasi",risk_label:"Risiko tinggi",kbli_code:"66411",category:"Pembayaran",sort_order:4},
  {name:"Simpan pinjam",description:"Unit Simpan Pinjam Koperasi Primer. Dokumen NIB mencatat izin belum terbit dan persyaratan perlu dipenuhi sebelum kegiatan operasional.",status_label:"Izin belum terbit pada dokumen",risk_label:"Risiko tinggi",kbli_code:"64142",category:"Keuangan",sort_order:5},
  {name:"Ruang pengembangan",description:"Apotek/obat murah, klinik desa, sarana logistik, dan pergudangan tercantum sebagai kategori pada format laporan koperasi. Status operasional perlu dikonfirmasi.",status_label:"Kategori pada laporan · bukan konfirmasi operasi",risk_label:"Perlu verifikasi",kbli_code:"",category:"Pengembangan",sort_order:6}
];
const fallbackGallery = [
  {title:"Musyawarah pembentukan",category:"Kebersamaan · 2025",image_url:"/assets/meeting.svg",sort_order:1},
  {title:"Pengelolaan kebutuhan pokok",category:"Kegiatan usaha",image_url:"/assets/stock.svg",sort_order:2},
  {title:"Aktivitas pengemasan",category:"Operasional",image_url:"/assets/packing.svg",sort_order:3},
  {title:"Identitas dan lingkungan koperasi",category:"Kerten · Surakarta",image_url:"/assets/hero-art.svg",sort_order:4}
];
const fallbackTimeline = [
  {date_label:"MEI 2025",title:"Musyawarah pembentukan",description:"Dokumentasi musyawarah khusus pembentukan Koperasi Kelurahan Merah Putih wilayah Kerten.",sort_order:1},
  {date_label:"JUNI 2025",title:"Kegiatan usaha mikro berjalan",description:"Dokumen NIB mencatat kegiatan usaha mikro berjalan sejak Juni 2025.",sort_order:2},
  {date_label:"25 JULI 2025",title:"Nomor Induk Berusaha diterbitkan",description:"NIB 2507250093543 diterbitkan untuk Koperasi Kelurahan Merah Putih Kerten.",sort_order:3},
  {date_label:"2026",title:"Aktivitas dan penguatan layanan",description:"Dokumentasi kegiatan 2026 menunjukkan aktivitas pengelolaan barang, stok, pengemasan, dan koordinasi pengurus.",sort_order:4}
];

let content={...fallbackContent},units=[...fallbackUnits],gallery=[...fallbackGallery],team=[],timeline=[...fallbackTimeline],testimonials=[];
let supabase=null,activeGalleryIndex=0,isPresenting=false,panels=[],panelIndex=0;
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const escapeHtml=(value="")=>String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const safeUrl=(value,fallback="/assets/hero-art.svg")=>{const url=String(value||"").trim();return /^https?:\/\//i.test(url)||/^\/assets\/[a-z0-9._/-]+$/i.test(url)?url:fallback;};
function safeText(selector,value){const el=$(selector);if(el&&value!==undefined&&value!==null)el.textContent=value;}
function safeHeadline(selector,value){const el=$(selector);if(!el)return;const escaped=escapeHtml(value||"");el.innerHTML=escaped.replace(/\n/g,"<br>").replace(/&lt;em&gt;/g,"<em>").replace(/&lt;\/em&gt;/g,"</em>").replace(/&lt;br\s*\/?&gt;/gi,"<br>");}
function statusClass(value){return /izin|verifikasi|pemenuhan|konfirmasi|belum/i.test(value||"")?" business-status--muted":"";}

async function connectSupabase(){
  const cfg=window.KKMP_CONFIG||{};
  if(!cfg.supabaseUrl||!cfg.supabaseAnonKey)return;
  try{
    const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabase=createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});
    const queries=await Promise.all([
      supabase.from("site_content").select("payload").eq("id","main").maybeSingle(),
      supabase.from("business_units").select("*").eq("is_published",true).order("sort_order"),
      supabase.from("gallery_items").select("*").eq("is_published",true).order("sort_order"),
      supabase.from("team_members").select("*").eq("is_published",true).order("sort_order"),
      supabase.from("timeline_items").select("*").eq("is_published",true).order("sort_order"),
      supabase.from("testimonials").select("*").eq("is_published",true).order("sort_order")
    ]);
    const [siteRes,unitRes,galleryRes,teamRes,timelineRes,testimonialRes]=queries;
    if(siteRes.data?.payload)content={...content,...siteRes.data.payload};
    if(unitRes.data)units=unitRes.data.length?unitRes.data:[];
    if(galleryRes.data)gallery=galleryRes.data.length?galleryRes.data:[];
    if(teamRes.data)team=teamRes.data;
    if(timelineRes.data)timeline=timelineRes.data.length?timelineRes.data:[];
    if(testimonialRes.data)testimonials=testimonialRes.data;
  }catch(error){console.warn("Konten Supabase belum dapat dimuat; profil lokal digunakan.",error);}
}
function renderUnits(){
  const grid=$("#businessGrid");if(!grid)return;
  grid.innerHTML=units.map((unit,index)=>{
    const featured=index===0,icon=["✳","◈","⌁","＋","◎","✧"][index%6],number=String(index+1).padStart(2,"0");
    const code=unit.kbli_code?'<span class="business-code">KBLI '+escapeHtml(unit.kbli_code)+'</span>':"";
    return '<article class="business-card '+(featured?"business-card--feature":"")+'"><span class="business-number">'+number+' / '+escapeHtml((unit.category||"BIDANG USAHA").toUpperCase())+'</span><div class="business-icon">'+icon+'</div><h3>'+escapeHtml(unit.name||"Bidang usaha")+'</h3><p>'+escapeHtml(unit.description||"")+'</p>'+code+'<span class="business-status'+statusClass(unit.status_label)+'">'+escapeHtml((unit.status_label||"Status perlu diperbarui").toUpperCase())+'</span><span class="business-arrow">↗</span></article>';
  }).join("");
}
function renderGallery(){
  const grid=$("#galleryGrid");if(!grid)return;
  const classes=["gallery-card gallery-card--large","gallery-card","gallery-card","gallery-card gallery-card--wide"];
  if(!gallery.length){grid.innerHTML='<div class="gallery-empty">Dokumentasi kegiatan akan ditampilkan di sini. Pengelola dapat menambahkan foto melalui panel admin.</div>';return;}
  grid.innerHTML=gallery.slice(0,8).map((item,index)=>{
    const cls=classes[index]||"gallery-card";
    return '<button class="'+cls+'" data-gallery="'+index+'"><img src="'+escapeHtml(safeUrl(item.image_url,"/assets/meeting.svg"))+'" alt="'+escapeHtml(item.title||"Dokumentasi KKMP Kerten")+'" loading="lazy"><span class="gallery-caption"><b>'+escapeHtml(item.title||"Dokumentasi kegiatan")+'</b><small>'+escapeHtml(item.category||"KKMP KERTEN").toUpperCase()+'</small></span><span class="gallery-open">↗</span></button>';
  }).join("");
}
function renderTeam(){
  const roles=$(".people-roles");if(!roles)return;
  if(!team.length){roles.innerHTML="<span>KETUA</span><span>SEKRETARIS</span><span>BENDAHARA</span>";return;}
  roles.innerHTML=team.map(member=>'<span>'+escapeHtml(member.role||"PENGURUS").toUpperCase()+(member.name?" · "+escapeHtml(member.name):"")+'</span>').join("");
}
function renderTimeline(){
  const grid=$("#timelineGrid");if(!grid)return;
  if(!timeline.length){grid.innerHTML='<p class="timeline-empty">Catatan perjalanan belum ditambahkan.</p>';return;}
  grid.innerHTML=timeline.map((item,index)=>'<article class="timeline-item reveal is-visible"><span class="timeline-date">'+escapeHtml(item.date_label||"")+'</span><div class="timeline-node"></div><div class="timeline-content"><h3>'+escapeHtml(item.title||"")+'</h3><p>'+escapeHtml(item.description||"")+'</p></div><span class="timeline-index">'+String(index+1).padStart(2,"0")+'</span></article>').join("");
}
function renderTestimonials(){
  const section=$("#testimoni"),grid=$("#testimonialGrid");if(!section||!grid)return;
  section.hidden=!testimonials.length;
  if(!testimonials.length)return;
  grid.innerHTML=testimonials.map(item=>'<article class="testimonial-card"><span class="testimonial-mark">“</span><blockquote>'+escapeHtml(item.quote||"")+'</blockquote><div><b>'+escapeHtml(item.author||"Masyarakat Kerten")+'</b><small>'+escapeHtml(item.role||"")+'</small></div></article>').join("");
}
function renderContent(){
  safeText("#heroEyebrow",content.hero_eyebrow);safeHeadline("#heroTitle",content.hero_title);safeText("#heroSubtitle",content.hero_subtitle);
  safeHeadline("#aboutTitle",content.about_title);safeText("#aboutBody",content.about_body);safeText("#aboutSecondary",content.about_secondary);
  safeText("#contactPhone",content.contact_phone);safeText("#contactEmail",content.contact_email);safeText("#contactAddress",content.contact_address);
  const phone=(content.contact_phone||"").replace(/[^\d+]/g,""),phoneLink=$("#contactPhoneLink"),emailLink=$("#contactEmailLink");
  if(phoneLink)phoneLink.href="tel:"+phone;if(emailLink)emailLink.href="mailto:"+content.contact_email;
  const hero=$("#heroImage"),about=$("#aboutImage"),operations=$("#operationsImage");
  if(hero&&content.hero_image_url)hero.src=safeUrl(content.hero_image_url);
  if(about&&content.about_image_url)about.src=safeUrl(content.about_image_url,"/assets/meeting.svg");
  if(operations&&content.operations_image_url)operations.src=safeUrl(content.operations_image_url,"/assets/stock.svg");
  renderUnits();renderGallery();renderTeam();renderTimeline();renderTestimonials();
}
function initReveal(){
  const elements=$$(".reveal");if(!("IntersectionObserver" in window)){elements.forEach(el=>el.classList.add("is-visible"));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:"0px 0px -35px 0px"});
  elements.forEach(el=>observer.observe(el));
}
function initNavigation(){
  const nav=$("#mainNav"),toggle=$("#menuToggle"),topbar=$("#topbar"),meter=$("#scrollMeter");
  toggle?.addEventListener("click",()=>nav?.classList.toggle("is-open"));
  $$("#mainNav a").forEach(link=>link.addEventListener("click",()=>nav?.classList.remove("is-open")));
  window.addEventListener("scroll",()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(meter)meter.style.width=(max>0?window.scrollY/max*100:0)+"%";
    topbar?.classList.toggle("is-compact",window.scrollY>45);
  },{passive:true});
  const sections=$$("main section[id]:not([hidden])");
  if("IntersectionObserver" in window){
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting)$$("#mainNav a").forEach(a=>a.classList.toggle("is-active",a.getAttribute("href")==="#"+entry.target.id));
    }),{rootMargin:"-40% 0px -50% 0px"});
    sections.forEach(section=>obs.observe(section));
  }
}
function setPanelCount(){safeText("#panelCurrent",String(panelIndex+1).padStart(2,"0"));safeText("#panelTotal",String(panels.length).padStart(2,"0"));}
function enterPresentation(){
  if(isPresenting)return;
  isPresenting=true;panels=$$("main section:not([hidden])");panelIndex=0;document.body.classList.add("is-presenting");
  document.documentElement.requestFullscreen?.().catch(()=>{});
  setPanelCount();panels[0]?.scrollIntoView({behavior:"smooth",block:"start"});
}
function exitPresentation(){
  isPresenting=false;document.body.classList.remove("is-presenting");
  if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});
  $("#presentationTrigger")?.focus();
}
function movePanel(direction){
  if(!isPresenting)return;
  panelIndex=Math.max(0,Math.min(panels.length-1,panelIndex+direction));
  panels[panelIndex]?.scrollIntoView({behavior:"smooth",block:"start"});setPanelCount();
}
function initPresentation(){
  $("#presentationTrigger")?.addEventListener("click",enterPresentation);$("#heroPlay")?.addEventListener("click",enterPresentation);
  $("#presentationExit")?.addEventListener("click",exitPresentation);
  $("#panelPrev")?.addEventListener("click",()=>movePanel(-1));$("#panelNext")?.addEventListener("click",()=>movePanel(1));
  $("#presentationFullscreen")?.addEventListener("click",()=>document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.());
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&isPresenting){exitPresentation();return;}
    if(!isPresenting)return;
    if(["ArrowDown","ArrowRight","PageDown"," "].includes(event.key)){event.preventDefault();movePanel(1);}
    if(["ArrowUp","ArrowLeft","PageUp"].includes(event.key)){event.preventDefault();movePanel(-1);}
    if(event.key.toLowerCase()==="f"){document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.();}
  });
  $("#mainContent")?.addEventListener("scroll",()=>{
    if(!isPresenting)return;
    const nearest=panels.map((panel,index)=>({index,distance:Math.abs(panel.getBoundingClientRect().top)})).sort((a,b)=>a.distance-b.distance)[0];
    if(nearest){panelIndex=nearest.index;setPanelCount();}
  },{passive:true});
}
function openLightbox(index){
  if(!gallery.length)return;activeGalleryIndex=(index+gallery.length)%gallery.length;
  const item=gallery[activeGalleryIndex],box=$("#lightbox"),img=$("#lightboxImage");
  img.src=safeUrl(item.image_url,"/assets/meeting.svg");img.alt=item.title||"Dokumentasi KKMP Kerten";
  safeText("#lightboxTitle",item.title||"Dokumentasi kegiatan");safeText("#lightboxMeta",(item.category||"KKMP KERTEN").toUpperCase());
  box.classList.add("is-open");box.setAttribute("aria-hidden","false");
}
function closeLightbox(){const box=$("#lightbox");box?.classList.remove("is-open");box?.setAttribute("aria-hidden","true");}
function initLightbox(){
  $("#galleryGrid")?.addEventListener("click",event=>{const button=event.target.closest("[data-gallery]");if(button)openLightbox(Number(button.dataset.gallery));});
  $("#lightboxClose")?.addEventListener("click",closeLightbox);$("#lightboxPrev")?.addEventListener("click",()=>openLightbox(activeGalleryIndex-1));$("#lightboxNext")?.addEventListener("click",()=>openLightbox(activeGalleryIndex+1));
  $("#lightbox")?.addEventListener("click",event=>{if(event.target.id==="lightbox")closeLightbox();});
  document.addEventListener("keydown",event=>{if(!$("#lightbox")?.classList.contains("is-open"))return;if(event.key==="Escape")closeLightbox();if(event.key==="ArrowLeft")openLightbox(activeGalleryIndex-1);if(event.key==="ArrowRight")openLightbox(activeGalleryIndex+1);});
}
async function init(){
  safeText("#yearNow",new Date().getFullYear());await connectSupabase();renderContent();initNavigation();initReveal();initPresentation();initLightbox();
  $("#pageLoader")?.classList.add("is-hidden");
  if(new URLSearchParams(location.search).get("present")==="1")enterPresentation();
}
init();
