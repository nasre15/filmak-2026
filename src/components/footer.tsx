import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-10 border-t border-gray-800 bg-black text-gray-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-right">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-red-600">
            فلمك <span className="text-white">بيطا</span>
          </h2>
          <p className="text-sm mt-1">© 2026 جميع الحقوق محفوظة</p>
        </div>

        <div className="flex space-x-6 rtl:space-x-reverse text-sm">
          <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
          <Link href="/explore" className="hover:text-white transition-colors">استكشف</Link>
          {/* تأكد من وجود هذه الصفحة أو اترك الرابط فارغاً مؤقتاً # ليتخطى الخطأ */}
          <Link href="/about" className="hover:text-white transition-colors">من نحن</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
