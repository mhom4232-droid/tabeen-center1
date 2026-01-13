// الرابط المباشر الخاص بك
const scriptURL = 'https://script.google.com/macros/s/AKfycbwbCIHmYCyeHqgOJQxbBhzEBdqB6qId979OdHq0ZSlbYGUJQbSzeIx1EjvcNU-zQAPXvw/exec';

// 1. نظام التنقل
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    const navItem = document.getElementById('nav-' + id);
    if(navItem) navItem.classList.add('active');

    if(id === 'honor') loadHonorRoll();
    window.scrollTo(0,0);
}

// 2. التحقق من دخول المعلم
function checkAdmin() {
    const pass = document.getElementById('sysPass').value;
    if(pass === "2026") {
        goToPage('admin');
    } else {
        alert("كلمة المرور غير صحيحة");
    }
}

// 3. جلب بيانات الطالب (ملف الطالب)
async function fetchStudent() {
    const id = document.getElementById('stdID').value;
    const btn = document.getElementById('loadBtn');
    if(!id) return alert("يرجى إدخال الـ ID");

    btn.innerText = "جاري الفتح...";
    btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();

        if(data.found) {
            document.getElementById('stdLogin').classList.add('hidden');
            document.getElementById('stdData').classList.remove('hidden');
            
            document.getElementById('nameDisplay').innerText = data["اسم الطالب"];
            document.getElementById('ringDisplay').innerText = `بإشراف المحفظ: ${data["اسم المحفظ"]}`;
            document.getElementById('msgDisplay').innerText = data["رسالة للأهل."] || "واصل اجتهادك يا بطل";
            document.getElementById('avatarLetter').innerText = data["اسم الطالب"].charAt(0);
            
            // تحديث التقدم
            const parts = parseInt(data["عدد الأجزاء المحفوظة"]) || 0;
            const percent = Math.round((parts / 30) * 100);
            document.getElementById('progressBar').style.width = percent + '%';
            document.getElementById('percentDisplay').innerText = percent + '%';
        } else {
            alert("⚠️ هذا الـ ID غير مسجل");
        }
    } catch (e) {
        alert("خطأ في الاتصال بالسجل");
    } finally {
        btn.innerText = "فتح الملف";
        btn.disabled = false;
    }
}

// 4. حفظ البيانات (لوحة المعلم)
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

    if(!params.id || !params.parts) return alert("يرجى ملء الـ ID وعدد الأجزاء");

    btn.innerText = "جاري الحفظ الآن...";
    btn.disabled = true;

    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(params)
        });
        alert("✅ تم التحديث بنجاح في سجلات مركز التابعين");
        location.reload();
    } catch (e) {
        alert("فشل في تحديث البيانات");
    } finally {
        btn.innerText = "حفظ في السجل";
        btn.disabled = false;
    }
}

// 5. تحميل لوحة الشرف
async function loadHonorRoll() {
    const list = document.getElementById('honorList');
    list.innerHTML = '<p class="text-slate-300 py-10">جاري تحميل الأبطال...</p>';
    
    try {
        const res = await fetch(`${scriptURL}?action=getAllStudents`);
        const students = await res.json();
        const topOnes = students.filter(s => s["درجة اليوم"] && s["درجة اليوم"].includes("ممتاز مرتفع"));
        
        list.innerHTML = topOnes.length > 0 ? '' : '<p class="text-slate-400 py-10">بانتظار المتميزين لهذا اليوم</p>';
        
        topOnes.forEach(s => {
            list.innerHTML += `
                <div class="official-card p-5 flex justify-between items-center border-r-4 border-amber-500">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 font-black">🌟</div>
                        <div class="text-right">
                            <h4 class="font-black text-sm">${s["اسم الطالب"]}</h4>
                            <p class="text-[9px] text-slate-400">حلقة المحفظ: ${s["اسم المحفظ"]}</p>
                        </div>
                    </div>
                    <i class="fas fa-certificate text-amber-300"></i>
                </div>
            `;
        });
    } catch (e) { list.innerHTML = "فشل التحميل"; }
}

// 6. تشغيل المعلم الذكي
function playAudio() {
    const s = document.getElementById('surahSelect').value;
    const player = document.getElementById('quranAudio');
    player.src = `https://server10.mp3quran.net/minsh/Mobile/${s}.mp3`;
    player.classList.remove('hidden');
    player.play();
}
