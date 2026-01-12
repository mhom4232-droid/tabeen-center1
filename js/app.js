const scriptURL = 'https://script.google.com/macros/s/AKfycby1d680TcH2q9YHiKm3zjX8tNqXJteVUqWgyLTORTowSlWPgIrW59LULoqcYKJsnscv9g/exec';

// 1. التنقل بين الصفحات
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

// 2. التحقق من دخول المحفظ
function checkAdmin() {
    if(document.getElementById('sysPass').value === "2026") {
        goToPage('teacherPanel');
    } else {
        alert("كلمة المرور غير صحيحة");
    }
}

// 3. جلب بيانات الطالب
async function fetchStudent() {
    const id = document.getElementById('stdID').value;
    const btn = document.getElementById('loadBtn');
    if(!id) return alert("أدخل الـ ID");

    btn.innerText = "جاري التحميل...";
    btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();
        if(data.found) {
            document.getElementById('loginArea').classList.add('hidden');
            document.getElementById('dataArea').classList.remove('hidden');
            document.getElementById('stdName').innerText = data["اسم الطالب"];
            document.getElementById('stdMsg').innerText = data["رسالة للأهل."] || "واصل اجتهادك يا بطل";
            
            const parts = parseInt(data["عدد الأجزاء المحفوظة"]) || 0;
            const percent = Math.round((parts / 30) * 100);
            document.getElementById('progressBar').style.width = percent + '%';
            document.getElementById('percentText').innerText = percent + '%';
        } else { alert("الطالب غير مسجل"); }
    } catch (e) { alert("خطأ في الاتصال"); }
    finally { btn.innerText = "دخول"; btn.disabled = false; }
}

// 4. تحديث البيانات (لوحة المحفظ)
async function updateStudentData() {
    const btn = document.getElementById('tSubmitBtn');
    const params = {
        action: 'updateScore',
        id: document.getElementById('tTargetID').value,
        parts: document.getElementById('tParts').value,
        grade: document.getElementById('tGrade').value,
        today: document.getElementById('tTodayRecord').value,
        msg: document.getElementById('tMsg').value
    };

    if(!params.id || !params.parts) return alert("يرجى ملء البيانات الأساسية");

    btn.innerText = "جاري الحفظ...";
    btn.disabled = true;

    try {
        // نستخدم POST مع الرابط
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // لضمان العمل مع Google Apps Script
            body: JSON.stringify(params)
        });
        alert("✅ تم تحديث بيانات الطالب بنجاح!");
        location.reload(); // إعادة التحميل لتحديث الحالة
    } catch (e) {
        alert("فشل التحديث، تأكد من اتصالك");
    } finally {
        btn.innerText = "حفظ البيانات";
        btn.disabled = false;
    }
}
