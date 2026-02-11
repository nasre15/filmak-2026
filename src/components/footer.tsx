import React from 'react';

const Footer = () => {
  const currentYear = 2026; // تحديث السنة لعام 2026

  return (
    <footer className="w-full py-8 mt-10 border-t border-gray-800 bg-black text-gray-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-red-600 tracking-tighter">
            فلمك <span className="text-white">بيطا</span>
          </h2>
          <p className="text-sm mt-1">جميع الحقوق محفوظة © {currentYear}</p>
        </div>

        <div className="flex space-x-6 rtl:space-x-reverse text-sm">
          <a href="/about" className="hover:text-white transition-colors">من نحن</a>
          <a href="/explore" className="hover:text-white transition-colors">استكشف</a>
          <a href="/privacy" className="hover:text-white transition-colors">الخصوصية</a>
        </div>

        <div className="mt-4 md:mt-0 text-xs opacity-50">
          النسخة التجريبية 2.0.26
        </div>
      </div>
    </footer>
  );
};

export default Footer;
