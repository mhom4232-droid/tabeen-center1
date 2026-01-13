const scriptURL = 'https://script.google.com/macros/s/AKfycbyYdIzUVdIEnhbz5yBkoOhdnL691Um2EJPHnmneEQsNvPQyFeyRKQ6-UTWgNRJp-dWs0A/exec';

// ميزة 10: صندوق الإلهام المتجدد
const quotes = [
    "القرآن نورٌ يضيء عتمة القلوب، فاستضئ به.",
    "من أراد الدنيا فعليه بالقرآن، ومن أراد الآخرة فعليه بالقرآن.",
    "خيركم من تعلم القرآن وعلمه.",
    "صاحب القرآن يلبس والداه تاجاً يوم القيامة.",
    "القرآن يشفع لصاحبه، فكن في زمرة الشافعين."
];

window.onload = () => {
    document.getElementById('quote').innerText = quotes[Math.floor(Math.random() * quotes.length)];
};

function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const nav = document.getElementById('n-' + id);
    if(nav) nav.classList.add('active');
    window.scrollTo(0,0);
}

// ميزة 1: نظام الرتب الذكي
function getRank(parts) {
    if(parts >= 30) return "الحافظ المتقن 👑";
    if(parts >= 15) return "نوارة المركز 🌟";
    if(parts >= 5) return "طالب مجتهد ✅";
    return "برعم قرآني 🌱";
}

// جلب بيانات الطالب + ميزة 18 (الاحتفال)
async function fetchStudent() {
    const id = document.getElementById('stdID').value;
    if(!id) return;
    const btn = document.getElementById('loadBtn');
    btn.innerText = "جاري فتح السجل..."; btn.disabled = true;

    try {
        const res = await fetch(`${scriptURL}?action=getStudent&id=${id}`);
        const data = await res.json();
        if(data.found) {
            document.getElementById('stdLogin').classList.add('hidden');
            document.getElementById('stdData').classList.remove('hidden');
            
            document.getElementById('nameDisplay').innerText = data["اسم الطالب"];
            document.getElementById('msgDisplay').innerText = data["رسالة للأهل."] || "واصل ثباتك يا بطل";
            document.getElementById('gradeDisplay').innerText = data["درجة اليوم"];
            document.getElementById('partsDisplay').innerText = data["عدد الأجزاء المحفوظة"];
            
            const parts = parseInt(data["عدد الأجزاء المحفوظة"]) || 0;
            const pct = Math.min(Math.round((parts / 30) * 100), 100);
            
            document.getElementById('progressBar').style.width = pct + '%';
            document.getElementById('percentDisplay').innerText = pct + '%';
            document.getElementById('rankBadge').innerText = getRank(parts);

            // ميزة 18: احتفال عند الدرجة الممتازة
            if(data["درجة اليوم"].includes("ممتاز")) {
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }
        } else alert("الكود غير مسجل في المركز");
    } catch (e) { alert("خطأ في الاتصال"); }
    finally { btn.innerText = "كشف الحساب"; btn.disabled = false; }
}

// ميزة 4: مشاركة الإنجاز
function shareCard() {
    const name = document.getElementById('nameDisplay').innerText;
    const rank = document.getElementById('rankBadge').innerText;
    const text = `أبشركم، حققت رتبة (${rank}) في مركز التابعين القرآني! عقبال الختمة يا رب.`;
    if (navigator.share) {
        navigator.share({ title: 'إنجازي القرآني', text: text, url: window.location.href });
    } else {
        alert("قم بتصوير الشاشة ومشاركة تميزك مع أهلك!");
    }
}

// الإدارة
function checkAdmin() {
    if(document.getElementById('sysPass').value === "2026") goToPage('admin');
    else alert("كلمة المرور خاصة بالمحفظين فقط");
}

let updatesToday = 0;
async function submitTeacherUpdate() {
    const btn = document.getElementById('upBtn');
    const data = {
        action: "updateScore",
        id: document.getElementById('upID').value,
        parts: document.getElementById('upParts').value,
        grade: document.getElementById('upGrade').value,
        msg: document.getElementById('upMsg').value
    };
    if(!data.id) return alert("يرجى إدخال كود الطالب");
    btn.innerText = "جاري الحفظ..."; btn.disabled = true;

    try {
        await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
        updatesToday++;
        document.getElementById('updateCount').innerText = `تحديثات اليوم: ${updatesToday}`;
        alert("تم الحفظ بنجاح ✅");
        document.getElementById('upID').value = "";
    } catch (e) { alert("حدث خطأ"); }
    finally { btn.innerText = "رصد الإنجاز"; btn.disabled = false; }
}

function playAudio() {
    const s = document.getElementById('surahSelect').value;
    const a = document.getElementById('quranAudio');
    a.src = `https://server10.mp3quran.net/minsh/Mobile/${s}.mp3`;
    a.classList.remove('hidden'); a.play();
}
