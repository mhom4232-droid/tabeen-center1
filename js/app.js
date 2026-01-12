// رابط السكربت الجديد الخاص بك
const scriptURL = 'https://script.google.com/macros/s/AKfycby2lN66AeomSW1h3Gmsoyj_1vn66cYqhTsxehaWBaH7xVgllH2Rtx0H6L_gJI4AfmPedA/exec';

/**
 * 1. نظام التنقل السلس بين صفحات الموقع
 */
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    setTimeout(() => {
        const target = document.getElementById(id);
        if(target) target.classList.add('active');
    }, 50);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 2. التحقق من صلاحيات دخول المحفظين (كلمة المرور 2026)
 */
function checkAccess() {
    const pass = document.getElementById('sysPassword').value;
    if (pass === "2026") {
        goToPage('teacherDashboard');
    } else {
        alert("⚠️ كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.");
    }
}

/**
 * 3. جلب بيانات الطالب من ورقة "قاعدة بيانات الطلاب المسجلين"
 */
async function fetchStudentData() {
    const id = document.getElementById('studentID').value;
    const btn = document.getElementById('stdQueryBtn');
    
    if(!id) return alert("يرجى إدخال رقم الطالب (ID)");

    btn.innerText = "جاري الاتصال بالسجل...";
    btn.disabled = true;

    try {
        const response = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await response.json();

        if(data.found) {
            document.getElementById('studentLoginSection').classList.add('hidden');
            document.getElementById('studentDisplayArea').classList.remove('hidden');
            
            // ربط البيانات مع أسماء الأعمدة الدقيقة في جدولك
            document.getElementById('displayName').innerText = data["اسم الطالب"];
            document.getElementById('displayRing').innerText = `حلقة المحفظ: ${data["اسم المحفظ"]}`;
            document.getElementById('displayGrade').innerText = data["درجة اليوم"] || "---";
            document.getElementById('displayToday').innerText = data["تسميع اليوم"] || "---";
            document.getElementById('parentMessage').innerText = data["رسالة للأهل."] || "نسأل الله لك الثبات والتوفيق.";
            
            // استخراج الحرف الأول للأفاتار
            document.getElementById('avatarLetter').innerText = data["اسم الطالب"].charAt(0);
            
            // تحديث خريطة الختمة
            updateJourneyMap(data["عدد الأجزاء المحفوظة"]);
        } else {
            alert("⚠️ عذراً، هذا الرقم (ID) غير موجود في قاعدة بيانات الطلاب.");
        }
    } catch (e) {
        alert("❌ حدث خطأ في الاتصال، تأكد من نشر السكربت (Deployment) بشكل صحيح.");
    } finally {
        btn.innerText = "فتح الملف الشخصي";
        btn.disabled = false;
    }
}

/**
 * 4. إرسال بيانات التسجيل الجديد لورقة "تسجيل الطلاب الجدد"
 */
async function submitNewRegistration() {
    const btn = document.querySelector('#registration button');
    const data = {
        action: 'register',
        name: document.getElementById('regName').value,
        phone: document.getElementById('regPhone').value,
        mosque: document.getElementById('regMosque').value,
        teacher: document.getElementById('regTeacher').value
    };

    if(!data.name || !data.phone) return alert("يرجى تعبئة الاسم ورقم التواصل");

    btn.innerText = "جاري الإرسال...";
    btn.disabled = true;

    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(data)
        });
        alert("✅ تم إرسال طلبك بنجاح! سيتم مراجعة الطلب والتواصل معكم.");
        location.reload(); 
    } catch (e) {
        alert("❌ حدث خطأ أثناء إرسال البيانات.");
    }
}

/**
 * 5. رسم خريطة أجزاء القرآن الكريم (30 جزء)
 */
function updateJourneyMap(parts) {
    const container = document.getElementById('journeyDots');
    container.innerHTML = '';
    const numParts = parseInt(parts) || 0;

    for (let i = 1; i <= 30; i++) {
        const dot = document.createElement('div');
        dot.className = `w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${i <= numParts ? 'bg-amber-500 text-white shadow-lg' : 'bg-gray-100 text-gray-300'}`;
        dot.innerText = i;
        container.appendChild(dot);
    }
    document.getElementById('journeyText').innerText = `أنجزت ${numParts} أجزاء من كتاب الله.. مبارك لك!`;
}

function logout() { location.reload(); }