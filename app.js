const fallbackContent = {
  hero_eyebrow: "KOPERASI KELURAHAN MERAH PUTIH · SURAKARTA",
  hero_title: "Gerak bersama.<br><em>Tumbuh</em> bersama.",
  hero_subtitle: "Dari Kerten, kami merawat semangat gotong royong menjadi gerak ekonomi yang dekat, nyata, dan bertumbuh bersama masyarakat.",
  about_title: "Satu wadah.<br><em>Banyak kemungkinan.</em>",
  about_body: "Koperasi Kelurahan Merah Putih Kerten hadir sebagai wadah ekonomi bersama di wilayah Kerten, Kecamatan Laweyan, Kota Surakarta. Berangkat dari kebutuhan masyarakat dan semangat gotong royong, koperasi mengembangkan kegiatan usaha yang dekat dengan kehidupan sehari-hari.",
  about_secondary: "Identitas dan bidang kegiatan usaha koperasi mengacu pada dokumen perizinan dan laporan yang tersedia. Narasi profil ini dapat diperbarui melalui panel admin seiring perkembangan koperasi.",
  contact_phone: "0812 2572 2106",
  contact_email: "kopkel.kerten@gmail.com",
  contact_address: "Jl. Ahmad Yani No. 377, Kerten, Laweyan, Kota Surakarta, Jawa Tengah 57143"
};
const fallbackUnits = [
  {name:"Sembako & kebutuhan pokok",description:"Perdagangan eceran berbagai macam barang yang utamanya makanan dan minuman.",status_label:"Tercatat dalam NIB",category:"Kebutuhan harian",sort_order:1},
  {name:"Gas LPG",description:"Perdagangan eceran gas elpiji.",status_label:"NIB & sertifikat standar terbit",category:"Distribusi",sort_order:2},
  {name:"Agen kurir",description:"Aktivitas agen kurir sebagai kegiatan pendukung.",status_label:"NIB & sertifikat standar terbit",category:"Layanan",sort_order:3},
  {name:"Jasa pembayaran",description:"Penyedia jasa pembayaran sebagaimana tercantum pada dokumen perizinan.",status_label:"Perlu verifikasi perizinan",category:"Pembayaran",sort_order:4},
  {name:"Simpan pinjam",description:"Unit simpan pinjam koperasi primer.",status_label:"Pemenuhan persyaratan izin",category:"Keuangan",sort_order:5},
  {name:"Ruang pengembangan",description:"Apotek/obat murah, klinik desa, sarana logistik, dan pergudangan tercantum sebagai kategori dalam laporan koperasi. Status operasional perlu dikonfirmasi.",status_label:"Kategori pada laporan",category:"Pengembangan",sort_order:6}
];
const fallbackGallery = [
  {title:"Musyawarah pembentukan",category:"Kebersamaan · 2025",image_url:"/assets/meeting.svg",sort_order:1},
  {title:"Pengelolaan kebutuhan pokok",category:"Kegiatan usaha",image_url:"/assets/stock.svg",sort_order:2},
  {title:"Aktivitas pengemasan",category:"Operasional",image_url:"/assets/packing.svg",sort_order:3},
  {title:"Lingkungan dan kolaborasi",category:"Kerten · Surakarta",image_url:"/assets/hero-art.svg",sort_order:4}
];
let content = {...fallbackContent};
let units = [...fallbackUnits];
let gallery = [...fallbackGallery];
let team = [];
let supabase = null;
let activeGalleryIndex = 0;
let isPresenting = false;
let panels = [];
let panelIndex = 0;

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

function safeText(selector, value) { const el=$(selector); if(el && value !== undefined && value !== null) el.textContent=value; }
function safeHtml(selector, value) { const el=$(selector); if(el && value !== undefined && value !== null) el.innerHTML=value; }
function escapeHtml(value="") { return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }

async function connectSupabase() {
  const cfg=window.KKMP_CONFIG||{};
  if(!cfg.supabaseUrl || !cfg.supabaseAnonKey) return;
  try {
    const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabase=createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});
    const [siteRes,unitRes,galleryRes,teamRes]=await Promise.all([
      supabase.from("site_content").select("payload").eq("id","main").maybeSingle(),
      supabase.from("business_units").select("*").eq("is_published",true).order("sort_order"),
      supabase.from("gallery_items").select("*").eq("is_published",true).order("sort_order"),
      supabase.from("team_members").select("*").eq("is_published",true).order("sort_order")
    ]);
    if(siteRes.data?.payload) content={...content,...siteRes.data.payload};
    if(unitRes.data?.length) units=unitRes.data;
    if(galleryRes.data?.length) gallery=galleryRes.data;
    if(teamRes.data?.length) team=teamRes.data;
  } catch(error) {
    console.warn("Supabase content could not be loaded; showing local profile content.",error);
  }
}

function renderContent() {
  safeText("#heroEyebrow",content.hero_eyebrow);
  safeHtml("#heroTitle",content.hero_title);
  safeText("#heroSubtitle",content.hero_subtitle);
  safeHtml("#aboutTitle",content.about_title);
  safeText("#aboutBody",content.about_body);
  safeText("#aboutSecondary",content.about_secondary);
  safeText("#contactPhone",content.contact_phone);
  safeText("#contactEmail",content.contact_email);
  safeText("#contactAddress",content.contact_address);
  const phone=(content.contact_phone||"").replace(/[^\d+]/g,"");
  const phoneLink=$("#contactPhoneLink"); if(phoneLink) phoneLink.href="tel:"+phone;
  const emailLink=$("#contactEmailLink"); if(emailLink) emailLink.href="mailto:"+content.contact_email;
  renderUnits();
  renderGallery();
  renderTeam();
}

function renderUnits() {
  const grid=$("#businessGrid"); if(!grid) return;
  grid.innerHTML=units.map((unit,index)=>{
    const featured=index===0;
    const icon=["✳","◈","⌁","＋","◎","✧"][index%6];
    const number=String(index+1).padStart(2,"0");
    const statusClass=/izin|verifikasi|pemenuhan|konfirmasi/i.test(unit.status_label||"")?" business-status--muted":"";
    return '<article class="business-card '+(featured?"business-card--feature":"")+'"><span class="business-number">'+number+' / '+escapeHtml((unit.category||"BIDANG USAHA").toUpperCase())+'</span><div class="business-icon">'+icon+'</div><h3>'+escapeHtml(unit.name).replace(/ & /g," &<br>")+'</h3><p>'+escapeHtml(unit.description)+'</p><span class="business-status'+statusClass+'">'+escapeHtml((unit.status_label||"").toUpperCase())+'</span><span class="business-arrow">↗</span></article>';
  }).join("");
}

function renderGallery() {
  const grid=$("#galleryGrid"); if(!grid) return;
  const classes=["gallery-card gallery-card--large","gallery-card","gallery-card","gallery-card gallery-card--wide"];
  grid.innerHTML=gallery.slice(0,8).map((item,index)=>{
    const cls=classes[index]||"gallery-card";
    return '<button class="'+cls+'" data-gallery="'+index+'"><img src="'+escapeHtml(item.image_url||"/assets/hero-art.svg")+'" alt="'+escapeHtml(item.title||"Dokumentasi KKMP Kerten")+'" loading="lazy"><span class="gallery-caption"><b>'+escapeHtml(item.title||"Dokumentasi kegiatan")+'</b><small>'+escapeHtml(item.category||"KKMP KERTEN").toUpperCase()+'</small></span><span class="gallery-open">↗</span></button>';
  }).join("");
  $$("#galleryGrid [data-gallery]").forEach(button=>button.addEventListener("click",()=>openLightbox(Number(button.dataset.gallery))));
}

function renderTeam() {
  const roles=$(".people-roles");
  if(!roles || !team.length) return;
  roles.innerHTML=team.map(member=>'<span>'+escapeHtml(member.role||"PENGURUS").toUpperCase()+(member.name?" · "+escapeHtml(member.name):"")+'</span>').join("");
}

function initReveal() {
  const elements=$$(".reveal");
  if(!("IntersectionObserver" in window)){elements.forEach(el=>el.classList.add("is-visible"));return;}
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});
  },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
  elements.forEach(el=>observer.observe(el));
}

function initNavigation() {
  const nav=$("#mainNav"),toggle=$("#menuToggle"),topbar=$("#topbar"),meter=$("#scrollMeter");
  toggle?.addEventListener("click",()=>nav.classList.toggle("is-open"));
  $$("#mainNav a").forEach(link=>link.addEventListener("click",()=>nav.classList.remove("is-open")));
  window.addEventListener("scroll",()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(meter) meter.style.width=(max>0?window.scrollY/max*100:0)+"%";
    topbar?.classList.toggle("is-compact",window.scrollY>45);
  },{passive:true});
  const sections=$$("main section[id]");
  if("IntersectionObserver" in window){
    const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        $$("#mainNav a").forEach(a=>a.classList.toggle("is-active",a.getAttribute("href")==="#"+entry.target.id));
      }
    }),{rootMargin:"-40% 0px -50% 0px"});
    sections.forEach(section=>obs.observe(section));
  }
}

function setPanelCount() {
  safeText("#panelCurrent",String(panelIndex+1).padStart(2,"0"));
  safeText("#panelTotal",String(panels.length).padStart(2,"0"));
}
function enterPresentation() {
  if(isPresenting) return;
  isPresenting=true;
  panels=$$("main section");
  panelIndex=0;
  document.body.classList.add("is-presenting");
  document.body.requestFullscreen?.().catch(()=>{});
  setPanelCount();
  panels[0]?.scrollIntoView({behavior:"smooth",block:"start"});
}
function exitPresentation() {
  isPresenting=false;
  document.body.classList.remove("is-presenting");
  if(document.fullscreenElement) document.exitFullscreen?.().catch(()=>{});
  $("#presentationTrigger")?.focus();
}
function movePanel(direction) {
  if(!isPresenting) return;
  panelIndex=Math.max(0,Math.min(panels.length-1,panelIndex+direction));
  panels[panelIndex]?.scrollIntoView({behavior:"smooth",block:"start"});
  setPanelCount();
}
function initPresentation() {
  $("#presentationTrigger")?.addEventListener("click",enterPresentation);
  $("#heroPlay")?.addEventListener("click",enterPresentation);
  $("#presentationExit")?.addEventListener("click",exitPresentation);
  $("#panelPrev")?.addEventListener("click",()=>movePanel(-1));
  $("#panelNext")?.addEventListener("click",()=>movePanel(1));
  $("#presentationFullscreen")?.addEventListener("click",()=>document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.());
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape" && isPresenting){exitPresentation();return;}
    if(!isPresenting) return;
    if(["ArrowDown","ArrowRight","PageDown"," "].includes(event.key)){event.preventDefault();movePanel(1);}
    if(["ArrowUp","ArrowLeft","PageUp"].includes(event.key)){event.preventDefault();movePanel(-1);}
    if(event.key.toLowerCase()==="f"){document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.();}
  });
  const main=$("#mainContent");
  main?.addEventListener("scroll",()=>{
    if(!isPresenting) return;
    const nearest=panels.map((p,i)=>({i,d:Math.abs(p.getBoundingClientRect().top)})).sort((a,b)=>a.d-b.d)[0];
    if(nearest){panelIndex=nearest.i;setPanelCount();}
  },{passive:true});
  document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement && isPresenting) document.body.classList.remove("is-presenting");});
}

function openLightbox(index) {
  if(!gallery.length) return;
  activeGalleryIndex=(index+gallery.length)%gallery.length;
  const item=gallery[activeGalleryIndex],box=$("#lightbox");
  $("#lightboxImage").src=item.image_url||"/assets/hero-art.svg";
  $("#lightboxImage").alt=item.title||"Dokumentasi KKMP Kerten";
  safeText("#lightboxTitle",item.title||"Dokumentasi kegiatan");
  safeText("#lightboxMeta",(item.category||"KKMP KERTEN").toUpperCase());
  box.classList.add("is-open");box.setAttribute("aria-hidden","false");
}
function closeLightbox(){const box=$("#lightbox");box.classList.remove("is-open");box.setAttribute("aria-hidden","true");}
function initLightbox(){
  $("#lightboxClose")?.addEventListener("click",closeLightbox);
  $("#lightboxPrev")?.addEventListener("click",()=>openLightbox(activeGalleryIndex-1));
  $("#lightboxNext")?.addEventListener("click",()=>openLightbox(activeGalleryIndex+1));
  $("#lightbox")?.addEventListener("click",event=>{if(event.target.id==="lightbox")closeLightbox();});
  document.addEventListener("keydown",event=>{if(!$("#lightbox")?.classList.contains("is-open"))return;if(event.key==="Escape")closeLightbox();if(event.key==="ArrowLeft")openLightbox(activeGalleryIndex-1);if(event.key==="ArrowRight")openLightbox(activeGalleryIndex+1);});
}

async function init() {
  safeText("#yearNow",new Date().getFullYear());
  await connectSupabase();
  renderContent();
  initNavigation();
  initReveal();
  initPresentation();
  initLightbox();
  setTimeout(()=>$("#pageLoader")?.classList.add("is-hidden"),450);
}
init();