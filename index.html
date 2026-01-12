const scriptURL = 'https://script.google.com/macros/s/AKfycby2lN66AeomSW1h3Gmsoyj_1vn66cYqhTsxehaWBaH7xVgllH2Rtx0H6L_gJI4AfmPedA/exec';

// 1. نظام التنقل والتحميل التلقائي
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    
    // أحداث خاصة عند دخول الصفحات
    if(id === 'honorRoll') fetchHonorRoll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. جلب ملف الطالب
async function fetchStudentData() {
    const id = document.getElementById('studentID').value;
    const btn = document.getElementById('stdQueryBtn');
    if(!id) return alert("أدخل رقم الـ ID");

    btn.innerText = "جاري التحقق...";
    btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();

        if(data.found) {
            document.getElementById('studentLogin').classList.add('hidden');
            document.getElementById('studentDisplay').classList.remove('hidden');
            
            document.getElementById('displayName').innerText = data["اسم الطالب"];
            document.getElementById('displayRing').innerText = `حلقة: ${data["اسم المحفظ"]}`;
            document.getElementById('teacherMsg').innerText = data["رسالة للأهل."] || "أنت فخر لنا، واصل الحفظ والتمكين.";
            document.getElementById('avatar').innerText = data["اسم الطالب"].charAt(0);
            
            // حساب التقدم
            const parts = parseInt(data["عدد الأجزاء المحفوظة"]) || 0;
            updateJourney(parts);
        } else {
            alert("الكود غير مسجل، يرجى مراجعة المحفظ.");
        }
    } catch (e) { alert("خطأ في الاتصال بالشبكة"); }
    finally { btn.innerText = "فتح السجل"; btn.disabled = false; }
}

// 3. تحديث خريطة الـ 30 جزء
function updateJourney(parts) {
    const container = document.getElementById('journeyPoints');
    container.innerHTML = '';
    const percent = Math.round((parts / 30) * 100);
    document.getElementById('progressPercent').innerText = percent + '%';

    for (let i = 1; i <= 30; i++) {
        const dot = document.createElement('div');
        dot.className = `journey-point ${i <= parts ? 'active' : ''}`;
        container.appendChild(dot);
    }
}

// 4. لوحة الشرف (جلب المتفوقين)
async function fetchHonorRoll() {
    const list = document.getElementById('honorList');
    list.innerHTML = '<div class="text-center p-10 text-slate-300">جاري البحث عن المتميزين...</div>';
    
    try {
        const res = await fetch(`${scriptURL}?action=getAllStudents`);
        const students = await res.json();
        
        // تصفية الطلاب الحاصلين على "ممتاز مرتفع"
        const stars = students.filter(s => s["درجة اليوم"] && s["درجة اليوم"].includes("ممتاز مرتفع"));
        
        list.innerHTML = '';
        if(stars.length === 0) {
            list.innerHTML = '<p class="text-center text-slate-400 p-10">بانتظار رصد درجات اليوم...</p>';
            return;
        }

        stars.forEach(s => {
            list.innerHTML += `
                <div class="official-card p-4 flex justify-between items-center border-r-4 border-amber-400">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 font-black italic">🌟</div>
                        <div>
                            <h4 class="font-black text-sm text-slate-800">${s["اسم الطالب"]}</h4>
                            <p class="text-[10px] font-bold text-slate-400">حلقة ${s["اسم المحفظ"]}</p>
                        </div>
                    </div>
                    <i class="fas fa-medal text-amber-300"></i>
                </div>
            `;
        });
    } catch (e) { list.innerHTML = 'فشل تحديث اللوحة'; }
}

// 5. المعلم الذكي: الاستماع
function playAudio() {
    const s = document.getElementById('surahSelect').value;
    const player = document.getElementById('player');
    player.src = `https://server10.mp3quran.net/minsh/Mobile/${s}.mp3`;
    player.classList.remove('hidden');
    player.play();
}

// 6. ميزة تحميل بطاقة التميز (تفاعلية)
function downloadCard() {
    alert("سيتم توليد بطاقة التميز الخاصة بك وتحميلها كصورة.. (ميزة قيد التطوير النهائي)");
}

function logout() { location.reload(); }
