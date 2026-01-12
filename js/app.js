const scriptURL = 'https://script.google.com/macros/s/AKfycby2lN66AeomSW1h3Gmsoyj_1vn66cYqhTsxehaWBaH7xVgllH2Rtx0H6L_gJI4AfmPedA/exec';

// 1. التنقل السلس بين الصفحات
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(id);
    if(target) target.classList.add('active');
    
    // تحميل البيانات تلقائياً عند دخول صفحات معينة
    if(id === 'honorRoll') loadHonorRoll();
    if(id === 'adminStats') loadAdminStats();
    window.scrollTo(0,0);
}

// 2. بوابة الطالب (مع شريط التقدم التلقائي)
async function fetchStudentData() {
    const id = document.getElementById('studentID').value;
    const btn = document.getElementById('stdQueryBtn');
    if(!id) return alert("أدخل كود ID الطالب");

    btn.innerText = "جاري التحقق...";
    btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();

        if(data.found) {
            document.getElementById('studentLoginSection').classList.add('hidden');
            document.getElementById('studentDisplayArea').classList.remove('hidden');
            
            document.getElementById('displayName').innerText = data["اسم الطالب"];
            document.getElementById('displayRing').innerText = `حلقة: ${data["اسم المحفظ"]}`;
            document.getElementById('displayGrade').innerText = data["درجة اليوم"];
            document.getElementById('displayToday').innerText = data["تسميع اليوم"];
            document.getElementById('avatarLetter').innerText = data["اسم الطالب"].charAt(0);
            
            // تحديث التقدم (الخريطة والشريط)
            const parts = parseInt(data["عدد الأجزاء المحفوظة"]) || 0;
            const percent = Math.round((parts / 30) * 100);
            document.getElementById('progressBar').style.width = percent + '%';
            document.getElementById('progressPercent').innerText = percent + '%';
            
            updateJourneyMap(parts);
        } else {
            alert("⚠️ الطالب غير مسجل حالياً");
        }
    } catch (e) { alert("فشل الاتصال"); } finally {
        btn.innerText = "دخول";
        btn.disabled = false;
    }
}

// 3. لوحة الشرف الآلية (تجلب من يحمل درجة ممتاز مرتفع)
async function loadHonorRoll() {
    const list = document.getElementById('honorList');
    try {
        const res = await fetch(`${scriptURL}?action=getAllStudents`); // تأكد من برمجة هذا في Google Apps Script
        const students = await res.json();
        
        const topOnes = students.filter(s => s["درجة اليوم"] && s["درجة اليوم"].includes("ممتاز مرتفع"));
        
        list.innerHTML = topOnes.length > 0 ? '' : '<div class="text-center text-slate-400 py-10">بانتظار الأبطال لهذا الأسبوع...</div>';
        
        topOnes.slice(0, 10).forEach((s, index) => {
            list.innerHTML += `
                <div class="mobile-card p-5 honor-roll-item border-2 flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <span class="text-amber-500 font-black text-xl">#${index+1}</span>
                        <div>
                            <h4 class="font-black text-sm text-slate-800">${s["اسم الطالب"]}</h4>
                            <p class="text-[10px] text-slate-400 italic">${s["اسم المحفظ"]}</p>
                        </div>
                    </div>
                    <i class="fas fa-certificate text-amber-400"></i>
                </div>
            `;
        });
    } catch (e) { list.innerHTML = "فشل في تحديث القائمة"; }
}

// 4. المعلم الذكي (تشغيل السور)
function playSurah() {
    const surah = document.getElementById('surahSelect').value;
    const audio = document.getElementById('quranAudio');
    const playerDiv = document.getElementById('audioPlayer');
    
    audio.src = `https://server10.mp3quran.net/minsh/Mobile/${surah}.mp3`;
    playerDiv.classList.remove('hidden');
    audio.play();
}

// 5. إحصائيات الإدارة للأستاذ إسماعيل نوفل
async function loadAdminStats() {
    try {
        const res = await fetch(`${scriptURL}?action=getStats`);
        const stats = await res.json();
        document.getElementById('totalStudents').innerText = stats.total;
        document.getElementById('topTeacher').innerText = stats.topTeacher;
    } catch (e) { console.log("خطأ في الإحصائيات"); }
}

function updateJourneyMap(parts) {
    const container = document.getElementById('journeyDots');
    container.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
        const dot = document.createElement('div');
        dot.className = `h-2 rounded-full ${i <= parts ? 'gold-gradient shadow-sm' : 'bg-slate-100'}`;
        container.appendChild(dot);
    }
}

function checkAccess() {
    const pass = document.getElementById('sysPassword').value;
    if(pass === "2026") goToPage('adminStats');
    else alert("كلمة المرور للإدارة فقط");
}

function logout() { location.reload(); }
