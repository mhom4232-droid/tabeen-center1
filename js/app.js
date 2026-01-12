// الرابط الخاص بك
const scriptURL = 'https://script.google.com/macros/s/AKfycby2lN66AeomSW1h3Gmsoyj_1vn66cYqhTsxehaWBaH7xVgllH2Rtx0H6L_gJI4AfmPedA/exec';

// 1. نظام التنقل
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        const target = document.getElementById(id);
        if(target) target.classList.add('active');
    }, 50);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. فحص صلاحيات المحفظ
function checkAccess() {
    if(document.getElementById('sysPassword').value === "2026") {
        goToPage('teacherDashboard');
    } else {
        alert("كلمة المرور خاطئة");
    }
}

// 3. جلب بيانات الطالب (تفاعلي)
async function fetchStudentData() {
    const id = document.getElementById('studentID').value;
    const btn = document.getElementById('stdQueryBtn');
    if(!id) return alert("أدخل كود الطالب");

    btn.innerText = "جاري فتح الملف...";
    btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();

        if(data.found) {
            document.getElementById('studentLoginSection').classList.add('hidden');
            document.getElementById('studentDisplayArea').classList.remove('hidden');
            
            // تعبئة البيانات الأساسية
            document.getElementById('displayName').innerText = data["اسم الطالب"];
            document.getElementById('displayRing').innerText = `حلقة المحفظ: ${data["اسم المحفظ"]}`;
            document.getElementById('displayGrade').innerText = data["درجة اليوم"] || "لم ترصد";
            document.getElementById('displayToday').innerText = data["تسميع اليوم"] || "---";
            document.getElementById('parentMessage').innerText = data["رسالة للأهل."] || "واصل اجتهادك يا بطل!";
            document.getElementById('avatarLetter').innerText = data["اسم الطالب"].charAt(0);
            
            // حساب التقدم وشريط الإنجاز
            const partsCount = parseInt(data["عدد الأجزاء المحفوظة"]) || 0;
            const percent = Math.round((partsCount / 30) * 100);
            
            document.getElementById('progressBar').style.width = percent + '%';
            document.getElementById('progressPercent').innerText = percent + '%';
            
            // رسم خريطة الـ 30 جزء التفاعلية
            updateJourneyMap(partsCount);
            
        } else {
            alert("⚠️ هذا الرقم غير مسجل في قاعدة البيانات");
        }
    } catch (e) {
        alert("خطأ في الاتصال بالخادم");
    } finally {
        btn.innerText = "دخول الملف";
        btn.disabled = false;
    }
}

// 4. رسم خريطة الختمة (النقاط التفاعلية)
function updateJourneyMap(parts) {
    const container = document.getElementById('journeyDots');
    container.innerHTML = '';
    
    for (let i = 1; i <= 30; i++) {
        const dot = document.createElement('div');
        dot.className = `journey-dot ${i <= parts ? 'completed' : ''}`;
        dot.innerText = i;
        
        // تأثير توهج على آخر جزء وصل إليه الطالب
        if (i === parts) dot.classList.add('dot-glow');
        
        container.appendChild(dot);
    }
    
    document.getElementById('journeyText').innerText = `بفضل الله، أنجزت ${parts} أجزاء من كتاب الله.`;
}

// 5. تحديث البيانات من لوحة المحفظ
async function submitTeacherUpdate() {
    const btn = document.getElementById('tUpdateBtn');
    const data = {
        action: 'updateScore',
        id: document.getElementById('tTargetID').value,
        parts: document.getElementById('tParts').value,
        grade: document.getElementById('tGrade').value,
        today: document.getElementById('tTodayRecord').value,
        msg: document.getElementById('tMsg').value
    };

    if(!data.id || !data.parts) return alert("أدخل الـ ID وعدد الأجزاء");

    btn.innerText = "جاري الحفظ...";
    btn.disabled = true;

    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });
        alert("✅ تم تحديث سجل الطالب بنجاح");
        location.reload();
    } catch (e) {
        alert("فشل في تحديث البيانات");
    }
}

function logout() { location.reload(); }
