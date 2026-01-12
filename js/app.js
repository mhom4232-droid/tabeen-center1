const scriptURL = 'https://script.google.com/macros/s/AKfycby2lN66AeomSW1h3Gmsoyj_1vn66cYqhTsxehaWBaH7xVgllH2Rtx0H6L_gJI4AfmPedA/exec';

function goToPage(id) {
    // إخفاء كل الصفحات
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // إظهار الصفحة المطلوبة بـ Animation
    setTimeout(() => {
        const target = document.getElementById(id);
        if(target) target.classList.add('active');
    }, 50);
}

async function fetchStudentData() {
    const id = document.getElementById('studentID').value;
    const btn = document.getElementById('stdQueryBtn');
    if(!id) return alert("أدخل كود الطالب");

    btn.innerText = "جاري الاتصال بالسحابة...";
    btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();

        if(data.found) {
            document.getElementById('studentLoginSection').classList.add('hidden');
            document.getElementById('studentDisplayArea').classList.remove('hidden');
            
            document.getElementById('displayName').innerText = data["اسم الطالب"];
            document.getElementById('displayRing').innerText = `حلقة: ${data["اسم المحفظ"]}`;
            document.getElementById('avatarLetter').innerText = data["اسم الطالب"].charAt(0);
            
            updateJourneyMap(data["عدد الأجزاء المحفوظة"]);
        } else {
            alert("⚠️ الكود غير موجود");
        }
    } catch (e) {
        alert("خطأ في الاتصال");
    } finally {
        btn.innerText = "عرض النتائج";
        btn.disabled = false;
    }
}

function updateJourneyMap(parts) {
    const container = document.getElementById('journeyDots');
    container.innerHTML = '';
    const num = parseInt(parts) || 0;
    for (let i = 1; i <= 30; i++) {
        const dot = document.createElement('div');
        dot.className = `w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${i <= num ? 'bg-amber-500 text-black shadow-lg scale-110' : 'bg-white/10 text-white/30'}`;
        dot.innerText = i;
        container.appendChild(dot);
    }
    document.getElementById('journeyText').innerText = `أنجزت ${num} أجزاء حتى الآن`;
}

function checkAccess() {
    if(document.getElementById('sysPassword').value === "2026") {
        goToPage('teacherDashboard');
    } else {
        alert("كلمة المرور خاطئة");
    }
}

function logout() { location.reload(); }
