const scriptURL = 'https://script.google.com/macros/s/AKfycbyYdIzUVdIEnhbz5yBkoOhdnL691Um2EJPHnmneEQsNvPQyFeyRKQ6-UTWgNRJp-dWs0A/exec';

// التنقل بين الصفحات
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    const navItem = document.getElementById('n-' + id);
    if(navItem) navItem.classList.add('active');
    window.scrollTo(0,0);
}

// فتح تفاصيل الحلقات
function toggleDetails(id) {
    const el = document.getElementById(id);
    el.classList.toggle('hidden');
}

// جلب بيانات الطالب (من صفحة الطلاب المسجلين)
async function getStudentInfo() {
    const id = document.getElementById('stdID').value;
    const btn = document.getElementById('searchBtn');
    if(!id) return alert("أدخل الكود");

    btn.innerText = "جاري الفتح..."; btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();
        const display = document.getElementById('stdResult');
        
        if(data.found) {
            display.classList.remove('hidden');
            display.innerHTML = `
                <div class="text-center mb-4">
                    <h2 class="text-xl font-black text-slate-800">${data["اسم الطالب"]}</h2>
                    <p class="text-xs text-amber-600 font-bold">حلقة: ${data["اسم المحفظ"]}</p>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-4 text-center">
                    <div class="bg-slate-50 p-3 rounded-xl"><span class="block text-[10px] text-slate-400">الأجزاء</span><span class="font-black">${data["عدد الأجزاء المحفوظة"]}</span></div>
                    <div class="bg-slate-50 p-3 rounded-xl"><span class="block text-[10px] text-slate-400">الدرجة</span><span class="font-black">${data["درجة اليوم"]}</span></div>
                </div>
                <div class="bg-blue-50 p-4 rounded-xl italic text-sm text-blue-700">"${data["رسالة للأهل."] || 'واصل حفظك يا بطل'}"</div>
            `;
        } else {
            alert("الكود غير موجود في سجلاتنا");
        }
    } catch (e) { alert("خطأ في الاتصال"); }
    finally { btn.innerText = "فتح الملف"; btn.disabled = false; }
}

// إرسال تسجيل جديد (إلى صفحة التسجيل الجديد في قوقل شيت)
document.getElementById('regForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerText = "جاري الإرسال..."; btn.disabled = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.action = "registerNew"; // تحديد الأكشن للسكريب

    try {
        await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        alert("تم استلام طلبك بنجاح! سنتواصل معك قريباً.");
        e.target.reset();
        goToPage('home');
    } catch (err) { alert("فشل الإرسال، حاول لاحقاً"); }
    finally { btn.innerText = "إرسال الطلب"; btn.disabled = false; }
};

// لوحة الإدارة
function checkAdmin() {
    if(document.getElementById('adminPass').value === "2026") {
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
    } else alert("باسوورد خطأ");
}

// تحديث بيانات الطالب (للمحفظين)
async function updateStudent() {
    const btn = document.getElementById('upBtn');
    const data = {
        action: "updateScore",
        id: document.getElementById('upID').value,
        parts: document.getElementById('upParts').value,
        grade: document.getElementById('upGrade').value,
        msg: document.getElementById('upMsg').value
    };

    if(!data.id) return alert("ادخل الـ ID");
    btn.innerText = "جاري الحفظ..."; btn.disabled = true;

    try {
        await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        alert("تم تحديث السجل بنجاح ✅");
        document.getElementById('upID').value = '';
    } catch (e) { alert("فشل التحديث"); }
    finally { btn.innerText = "حفظ التغييرات"; btn.disabled = false; }
}
