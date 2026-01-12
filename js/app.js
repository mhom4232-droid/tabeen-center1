const scriptURL = 'https://script.google.com/macros/s/AKfycby2lN66AeomSW1h3Gmsoyj_1vn66cYqhTsxehaWBaH7xVgllH2Rtx0H6L_gJI4AfmPedA/exec';

// 1. نظام التنقل (يعتمد على كلاس active)
function goToPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // إظهار الصفحة المطلوبة
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0,0);
    }
}

// 2. فحص الدخول للمحفظين
function checkAccess() {
    const pass = document.getElementById('sysPassword').value;
    if (pass === "2026") {
        goToPage('teacherDashboard');
    } else {
        alert("⚠️ كلمة المرور خاطئة");
    }
}

// 3. جلب بيانات الطالب من جوجل شيت
async function fetchStudentData() {
    const id = document.getElementById('studentID').value;
    const btn = document.getElementById('stdQueryBtn');
    
    if(!id) return alert("يرجى إدخال الرقم التعريفي");

    btn.innerText = "جاري البحث...";
    btn.disabled = true;

    try {
        const response = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await response.json();

        if(data.found) {
            document.getElementById('studentLoginSection').classList.add('hidden');
            document.getElementById('studentDisplayArea').classList.remove('hidden');
            
            // تعبئة البيانات حسب أسماء الأعمدة في صورتك
            document.getElementById('displayName').innerText = data["اسم الطالب"];
            document.getElementById('displayRing').innerText = `حلقة: ${data["اسم المحفظ"]}`;
            document.getElementById('displayGrade').innerText = data["درجة اليوم"] || "---";
            document.getElementById('displayToday').innerText = data["تسميع اليوم"] || "---";
        } else {
            alert("⚠️ عذراً، الطالب غير مسجل.");
        }
    } catch (e) {
        alert("خطأ في الاتصال بالسجل السحابي.");
    } finally {
        btn.innerText = "فتح الملف";
        btn.disabled = false;
    }
}

// 4. إرسال تسجيل جديد
async function submitNewRegistration() {
    const data = {
        action: 'register',
        name: document.getElementById('regName').value,
        phone: document.getElementById('regPhone').value
    };
    if(!data.name) return alert("أدخل الاسم");
    
    try {
        await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data)});
        alert("✅ تم إرسال طلبك بنجاح");
        location.reload();
    } catch(e) { alert("خطأ في الإرسال"); }
}

function logout() { location.reload(); }
