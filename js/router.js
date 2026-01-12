// وظيفة التنقل بين الصفحات
function showPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page-view').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });

    // إظهار الصفحة المطلوبة
    const activePage = document.getElementById('page-' + pageId);
    if (activePage) {
        activePage.classList.remove('hidden');
        setTimeout(() => activePage.classList.add('active'), 50);
    }
    
    // العودة لأعلى الصفحة عند التنقل
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

console.log("نظام التنقل جاهز للعمل ✅");