const scriptURL = 'https://script.google.com/macros/s/AKfycbwbCIHmYCyeHqgOJQxbBhzEBdqB6qId979OdHq0ZSlbYGUJQbSzeIx1EjvcNU-zQAPXvw/exec';

function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const n = document.getElementById('nav-' + id);
    if(n) n.classList.add('active');
    if(id === 'honor') loadHonorRoll();
    window.scrollTo(0,0);
}

function checkAdmin() {
    if(document.getElementById('sysPass').value === "2026") goToPage('admin');
    else alert("عذراً، كلمة المرور خاصة بالمحفظين");
}

async function fetchStudent() {
    const id = document.getElementById('stdID').value;
    if(!id) return alert("أدخل كود الطالب");
    const btn = document.getElementById('loadBtn');
    btn.innerText = "جاري البحث...";
    btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();
        if(data.found) {
            document.getElementById('stdLogin').classList.add('hidden');
            document.getElementById('stdData').classList.remove('hidden');
            document.getElementById('nameDisplay').innerText = data["اسم الطالب"];
            document.getElementById('msgDisplay').innerText = data["رسالة للأهل."] || "واصل اجتهادك يا بطل";
            document.getElementById('avatar').innerText = data["اسم الطالب"].charAt(0);
            const p = parseInt(data["عدد الأجزاء المحفوظة"]) || 0;
            const pct = Math.round((p / 30) * 100);
            document.getElementById('progressBar').style.width = pct + '%';
            document.getElementById('percentDisplay').innerText = pct + '%';
        } else alert("هذا الكود غير موجود");
    } catch (e) { alert("خطأ في الاتصال"); }
    finally { btn.innerText = "فتح السجل"; btn.disabled = false; }
}

async function saveUpdate() {
    const btn = document.getElementById('saveBtn');
    const params = {
        action: 'updateScore',
        id: document.getElementById('tID').value,
        parts: document.getElementById('tParts').value,
        grade: document.getElementById('tGrade').value,
        today: document.getElementById('tToday').value,
        msg: document.getElementById('tMsg').value
    };
    if(!params.id || !params.parts) return alert("املاً ID الطالب وعدد الأجزاء");
    btn.innerText = "جاري الحفظ..."; btn.disabled = true;
    try {
        await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(params) });
        alert("تم الحفظ بنجاح!");
        location.reload();
    } catch (e) { alert("خطأ في الحفظ"); }
    finally { btn.innerText = "حفظ في السجل"; btn.disabled = false; }
}

async function loadHonorRoll() {
    const l = document.getElementById('honorList');
    l.innerHTML = '<p class="text-center text-slate-300 py-10">جاري التحديث...</p>';
    try {
        const res = await fetch(`${scriptURL}?action=getAllStudents`);
        const sts = await res.json();
        const tops = sts.filter(s => s["درجة اليوم"] && s["درجة اليوم"].includes("ممتاز مرتفع"));
        l.innerHTML = tops.length ? '' : '<p class="text-center text-slate-400 py-10">لا يوجد متفوقين اليوم</p>';
        tops.forEach(s => {
            l.innerHTML += `<div class="official-card p-5 flex justify-between items-center border-r-4 border-amber-500">
                <div class="flex items-center gap-4 text-right">
                    <span class="text-xl">🌟</span>
                    <div><h4 class="font-black text-sm">${s["اسم الطالب"]}</h4><p class="text-[9px] text-slate-400">حلقة ${s["اسم المحفظ"]}</p></div>
                </div>
            </div>`;
        });
    } catch (e) { l.innerHTML = "خطأ في تحميل اللوحة"; }
}

function playAudio() {
    const s = document.getElementById('surahSelect').value;
    const a = document.getElementById('quranAudio');
    a.src = `https://server10.mp3quran.net/minsh/Mobile/${s}.mp3`;
    a.classList.remove('hidden'); a.play();
}
