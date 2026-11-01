const cfg=window.KKMP_CONFIG||{},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const tables={business:{table:"business_units",form:"businessForm",list:"businessList",count:"businessCount",title:r=>r.name,sub:r=>(r.kbli_code?"KBLI "+r.kbli_code+" · ":"")+(r.status_label||r.category||"")},timeline:{table:"timeline_items",form:"timelineForm",list:"timelineList",count:"timelineCount",title:r=>r.title,sub:r=>(r.date_label||"")+" · "+(r.description||"")},gallery:{table:"gallery_items",form:"galleryForm",list:"galleryList",count:"galleryCount",title:r=>r.title,sub:r=>r.category||r.description||""},team:{table:"team_members",form:"teamForm",list:"teamList",count:"teamCount",title:r=>r.name,sub:r=>r.role||""},testimonials:{table:"testimonials",form:"testimonialForm",list:"testimonialsList",count:"testimonialsCount",title:r=>r.author,sub:r=>r.role||r.quote||""}};
let sb=null,user=null,content={},records={business:[],timeline:[],gallery:[],team:[],testimonials:[]};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(msg,error=false){const el=$("#toast");el.textContent=msg;el.className="toast show"+(error?" error":"");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.className="toast",3200);}
function loginMessage(msg,error=false){const el=$("#loginMessage");el.textContent=msg;el.classList.toggle("error",error);}
function showLogin(){ $("#loginView").hidden=false;$("#workspace").hidden=true; }
function showWorkspace(){ $("#loginView").hidden=true;$("#workspace").hidden=false;$("#adminEmail").textContent=user?.email||"Admin";$("#settingsEmail").textContent=user?.email||"—"; }
async function authorize(u){const {data,error}=await sb.from("admin_users").select("role,is_active").eq("user_id",u.id).maybeSingle();if(error||!data||!data.is_active)throw new Error("Akun ini belum terdaftar sebagai admin KKMP.");user=u;}
async function login(e){e.preventDefault();const btn=$("#loginButton");btn.disabled=true;btn.textContent="Memeriksa akses…";try{const {data,error}=await sb.auth.signInWithPassword({email:$("#email").value.trim(),password:$("#password").value});if(error)throw error;await authorize(data.user);showWorkspace();await loadAll();loginMessage("");}catch(err){loginMessage(err.message||"Gagal masuk. Periksa email dan kata sandi.",true);await sb.auth.signOut();}finally{btn.disabled=false;btn.textContent="Masuk ke dashboard ↗";}}
async function loadAll(){const jobs=[["site_content",sb.from("site_content").select("payload").eq("id","main").maybeSingle()],...Object.entries(tables).map(([key,v])=>[key,sb.from(v.table).select("*").order("sort_order")])];const results=await Promise.all(jobs.map(async([key,q])=>({key,...await q})));for(const r of results){if(r.error){console.error(r.key,r.error);continue;}if(r.key==="site_content")content=r.data?.payload||{};else records[r.key]=r.data||[];}fillContent();renderAll();}
function fillContent(){const f=$("#contentForm");if(!f)return;for(const [k,v] of Object.entries(content)){if(f.elements[k])f.elements[k].value=v??"";}}
function renderAll(){for(const key of Object.keys(tables))renderList(key);$("#statBusiness").textContent=records.business.filter(x=>x.is_published).length;$("#statGallery").textContent=records.gallery.filter(x=>x.is_published).length;$("#statTeam").textContent=records.team.length;$("#statTestimonials").textContent=records.testimonials.filter(x=>x.is_published).length;}
function renderList(key){const meta=tables[key],list=$("#"+meta.list);if(!list)return;const rows=records[key]||[];$("#"+meta.count).textContent=rows.length+" ITEM";list.innerHTML=rows.length?rows.map(r=>'<article class="item"><div><div class="itemtitle">'+esc(meta.title(r)||"Tanpa judul")+'</div><div class="itemsub">'+esc(meta.sub(r)||"")+'</div><span class="state '+(r.is_published?"":"draft")+'">'+(r.is_published?"● TAYANG":"○ DRAF")+'</span></div><div class="itemactions"><button class="mini" data-edit="'+key+'" data-id="'+r.id+'">Edit</button><button class="mini" data-toggle="'+key+'" data-id="'+r.id+'">'+(r.is_published?"Sembunyikan":"Tayangkan")+'</button>'+(key==="gallery"?'<button class="mini" data-cover="'+r.id+'">Jadikan sampul</button>':"")+'<button class="mini" data-delete="'+key+'" data-id="'+r.id+'">Hapus</button></div></article>').join(""):'<div class="empty">Belum ada item. Tambahkan melalui formulir ini.</div>';}
function openTab(name){$$("[data-view]").forEach(b=>b.classList.toggle("active",b.dataset.view===name));$$("[data-panel]").forEach(p=>p.hidden=p.dataset.panel!==name);$("#pageTitle").textContent=({overview:"Ringkasan",content:"Konten utama",business:"Bidang usaha",timeline:"Perjalanan koperasi",gallery:"Galeri foto",team:"Pengurus",testimonials:"Testimoni masyarakat",settings:"Pengaturan"})[name]||"Admin";}
function formObject(form){const obj=Object.fromEntries(new FormData(form).entries());obj.sort_order=Number(obj.sort_order||0);obj.is_published=form.elements.is_published.checked;delete obj.image_file;if(!obj.id)delete obj.id;return obj;}
async function saveContent(e){e.preventDefault();const payload={...content,...Object.fromEntries(new FormData(e.currentTarget).entries())};try{const {error}=await sb.from("site_content").upsert({id:"main",payload,updated_at:new Date().toISOString()});if(error)throw error;content=payload;toast("Konten utama berhasil disimpan.");}catch(err){toast(err.message||"Gagal menyimpan konten.",true);}}
async function saveEntity(key,e){
  e.preventDefault();
  const form=e.currentTarget;
  try{
    const obj=formObject(form);
    if(key==="gallery"){
      const files=Array.from(form.elements.image_file?.files||[]);
      const existing=records.gallery.find(x=>x.id===obj.id);
      if(existing?.storage_path)obj.storage_path=existing.storage_path;
      if(files.length>1&&obj.id)throw new Error("Untuk mengedit foto lama, pilih satu foto saja. Kosongkan formulir untuk unggah banyak foto.");
      if(files.length){
        const bucket=sb.storage.from(cfg.mediaBucket||"kkmp-media");
        for(const file of files){
          if(file.size>10*1024*1024)throw new Error("Ukuran setiap foto maksimal 10 MB: "+file.name);
          if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("Format foto harus JPG, PNG, atau WebP: "+file.name);
        }
        if(files.length>1){
          const baseOrder=Number(obj.sort_order||1);
          for(let i=0;i<files.length;i++){
            const file=files[i],ext=file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
            const path="gallery/"+Date.now()+"-"+i+"-"+Math.random().toString(36).slice(2,9)+"."+ext;
            const {error:upErr}=await bucket.upload(path,file,{cacheControl:"3600",upsert:false});
            if(upErr)throw upErr;
            const row={...obj,title:obj.title+" · "+String(i+1).padStart(2,"0"),image_url:bucket.getPublicUrl(path).data.publicUrl,storage_path:path,sort_order:baseOrder+i};
            delete row.id;
            const {error:insertErr}=await sb.from("gallery_items").insert(row);
            if(insertErr)throw insertErr;
          }
          form.reset();
          if(form.elements.sort_order)form.elements.sort_order.value="1";
          if(form.elements.is_published)form.elements.is_published.checked=true;
          await loadAll();
          toast(files.length+" foto asli berhasil diunggah.");
          return;
        }
        const file=files[0],ext=file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g,"")||"jpg";
        const path="gallery/"+Date.now()+"-"+Math.random().toString(36).slice(2,9)+"."+ext;
        const {error:upErr}=await bucket.upload(path,file,{cacheControl:"3600",upsert:false});
        if(upErr)throw upErr;
        obj.image_url=bucket.getPublicUrl(path).data.publicUrl;
        obj.storage_path=path;
      }
      if(!obj.image_url)throw new Error("Pilih foto asli atau isi URL foto terlebih dahulu.");
    }
    const {error}=await sb.from(tables[key].table).upsert(obj);
    if(error)throw error;
    form.reset();
    if(form.elements.id)form.elements.id.value="";
    if(form.elements.sort_order)form.elements.sort_order.value="1";
    if(form.elements.is_published)form.elements.is_published.checked=key==="business"||key==="timeline"||key==="gallery";
    await loadAll();
    toast("Data berhasil disimpan.");
  }catch(err){toast(err.message||"Gagal menyimpan data.",true);}
}
function editItem(key,id){const row=records[key].find(x=>x.id===id);if(!row)return;const f=$("#"+tables[key].form);f.reset();for(const [k,v] of Object.entries(row)){if(f.elements[k]&&k!=="image_file")f.elements[k].type==="checkbox"?f.elements[k].checked=!!v:f.elements[k].value=v??"";}if(f.elements.id)f.elements.id.value=row.id;openTab(key);f.scrollIntoView({behavior:"smooth",block:"center"});}
async function deleteItem(key,id){if(!confirm("Hapus item ini? Tindakan ini tidak dapat dibatalkan."))return;const row=records[key].find(x=>x.id===id);try{if(key==="gallery"&&row?.storage_path)await sb.storage.from(cfg.mediaBucket||"kkmp-media").remove([row.storage_path]);const {error}=await sb.from(tables[key].table).delete().eq("id",id);if(error)throw error;await loadAll();toast("Item dihapus.");}catch(err){toast(err.message||"Gagal menghapus item.",true);}}
async function toggleItem(key,id){const row=records[key].find(x=>x.id===id);if(!row)return;try{const {error}=await sb.from(tables[key].table).update({is_published:!row.is_published}).eq("id",id);if(error)throw error;await loadAll();toast("Status publikasi diperbarui.");}catch(err){toast(err.message||"Gagal memperbarui status.",true);}}
async function setCover(id){const row=records.gallery.find(x=>x.id===id);if(!row?.image_url)return;content={...content,hero_image_url:row.image_url};try{const {error}=await sb.from("site_content").upsert({id:"main",payload:content,updated_at:new Date().toISOString()});if(error)throw error;fillContent();toast("Foto dipilih sebagai sampul website.");}catch(err){toast(err.message||"Gagal mengatur sampul.",true);}}
async function logout(){await sb.auth.signOut();user=null;showLogin();$("#password").value="";loginMessage("Anda sudah keluar dari panel admin.");}
async function resetPassword(){if(!user?.email)return;try{const {error}=await sb.auth.resetPasswordForEmail(user.email,{redirectTo:location.origin+"/admin/"});if(error)throw error;toast("Tautan ubah kata sandi dikirim ke email.");}catch(err){toast(err.message||"Gagal mengirim email.",true);}}
async function init(){const y=$("#loginYear");if(y)y.textContent=new Date().getFullYear();if(!cfg.supabaseUrl||!cfg.supabaseAnonKey){loginMessage("Database belum terhubung. Isi URL dan publishable/anon key Supabase di config.js.",true);$("#loginButton").disabled=true;return;}try{const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");sb=createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});const {data}=await sb.auth.getSession();if(data.session){try{await authorize(data.session.user);showWorkspace();await loadAll();}catch(err){await sb.auth.signOut();loginMessage(err.message,true);}}}catch(err){loginMessage("Koneksi Supabase gagal: "+err.message,true);}}
$("#loginForm").addEventListener("submit",login);$("#logoutButton").addEventListener("click",logout);$("#contentForm").addEventListener("submit",saveContent);for(const key of Object.keys(tables))$("#"+tables[key].form).addEventListener("submit",e=>saveEntity(key,e));$("#resetPassword").addEventListener("click",resetPassword);
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.view)));$$("[data-jump]").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.jump)));
document.addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]"),tog=e.target.closest("[data-toggle]"),cover=e.target.closest("[data-cover]");if(edit)editItem(edit.dataset.edit,edit.dataset.id);if(del)deleteItem(del.dataset.delete,del.dataset.id);if(tog)toggleItem(tog.dataset.toggle,tog.dataset.id);if(cover)setCover(cover.dataset.cover);});
init();