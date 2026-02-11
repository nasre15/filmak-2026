"use client";

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Film, Rocket, Smartphone, ArrowLeft, Bitcoin, Copy } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

// تم نقل الـ dynamic ليكون بعد الـ use client لضمان نجاح الـ build
export const dynamic = 'force-dynamic';

// Telegram SVG Icon Component
const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M21.1,3.4l-3.3,15.6c-0.2,0.9-0.7,1.1-1.5,0.7l-4.9-3.6L9.7,17.8c-0.5,0.5-0.9,0.9-1.8,0.9L8.2,13l-4.9-3.1 c-0.9-0.5-0.9-1.3,0.2-1.7l16.2-6.2C20.6,1.8,21.3,2.4,21.1,3.4z M9,13.8l1.3,4.3l0.3-4.5l6.9-6.2c0.3-0.3-0.1-0.5-0.5-0.2 l-8.6,5.6H9z" />
  </svg>
);

const formSchema = z.object({
  movieName: z.string().min(2, {
    message: 'يجب أن يكون اسم الفيلم حرفين على الأقل.',
  }),
  movieType: z.string().nonempty({ message: 'الرجاء تحديد نوع الفيلم.' }),
});

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const telegramContact = process.env.NEXT_PUBLIC_TELEGRAM_CONTACT || 'nasre15';
  const btcAddress = process.env.NEXT_PUBLIC_BITCOIN_ADDRESS || '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      movieName: '',
      movieType: 'Movie',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: t('aboutPage.form.toastTitle', 'شكراً لطلبك!'),
      description: t('aboutPage.form.toastDescription', 'سيتم توجيهك الآن لتأكيد الطلب عبر تلجرام.'),
    });

    const text = `${t('aboutPage.form.telegramMessage', 'أريد طلب فيلم:')} ${values.movieName} (${t('aboutPage.form.telegramType', 'النوع:')} ${t(`aboutPage.form.types.${values.movieType.toLowerCase()}`, values.movieType)})`;
    const telegramUrl = `https://t.me/${telegramContact}?text=${encodeURIComponent(text)}`;
    
    window.open(telegramUrl, '_blank');
  }

  const handleCopy = () => {
    if (btcAddress) {
      navigator.clipboard.writeText(btcAddress);
      toast({
        title: t('aboutPage.support.toastTitle', 'تم نسخ عنوان المحفظة بنجاح!'),
      });
    }
  };

  return (
    <div dir={i18n.dir()} className="bg-[#050505] text-white min-h-screen p-4 sm:p-8 pt-20">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="mb-8 inline-block">
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            <ArrowLeft className="me-2 h-4 w-4" />
            {t('aboutPage.backToHome', 'العودة للرئيسية')}
          </Button>
        </Link>

        <header className="text-center mb-16">
          <h1
            className="text-5xl md:text-7xl font-bold font-headline"
            style={{ textShadow: '0 0 15px #ff0000' }}
          >
            {t('aboutPage.title', 'من نحن')}
          </h1>
          <p className="mt-4 text-red-600 font-bold tracking-widest">FILMAK 2026 BETA</p>
        </header>

        <section className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-lg md:text-xl text-white/80 leading-relaxed">
            {t('aboutPage.story', 'فلمك هي وجهتك الأولى لمتابعة أحدث الأفلام، الأنمي، والرياضة بجودة عالية وتجربة مستخدم فريدة لعام 2026.')}
          </p>
        </section>

        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#111] border-white/10 text-center hover:border-red-600/50 transition-all">
              <CardHeader>
                <div className="mx-auto bg-red-600/10 p-4 rounded-full w-fit">
                  <Film className="h-10 w-10 text-red-600" />
                </div>
                <CardTitle className="pt-4 text-2xl text-white font-headline">{t('aboutPage.feature1.title', 'تنوع المحتوى')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t('aboutPage.feature1.description', 'أفلام، أنمي، رياضة والمزيد.')}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#111] border-white/10 text-center hover:border-red-600/50 transition-all">
              <CardHeader>
                 <div className="mx-auto bg-red-600/10 p-4 rounded-full w-fit">
                  <Rocket className="h-10 w-10 text-red-600" />
                </div>
                <CardTitle className="pt-4 text-2xl text-white font-headline">{t('aboutPage.feature2.title', 'سرعة البث')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t('aboutPage.feature2.description', 'بث سريع بدون تقطيع.')}</p>
              </CardContent>
            </Card>
            <Card className="bg-[#111] border-white/10 text-center hover:border-red-600/50 transition-all">
              <CardHeader>
                 <div className="mx-auto bg-red-600/10 p-4 rounded-full w-fit">
                  <Smartphone className="h-10 w-10 text-red-600" />
                </div>
                <CardTitle className="pt-4 text-2xl text-white font-headline">{t('aboutPage.feature3.title', 'تجربة مستخدم')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{t('aboutPage.feature3.description', 'تصميم متجاوب لجميع الأجهزة.')}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-20">
            <Card className="bg-[#111] border-white/10 w-full max-w-2xl mx-auto shadow-2xl shadow-red-900/10">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-headline text-white">{t('aboutPage.form.title', 'اطلب فيلمك')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="movieName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">{t('aboutPage.form.movieName', 'اسم الفيلم')}</FormLabel>
                                        <FormControl>
                                            <Input className="bg-black border-white/10 text-white focus:border-red-600" placeholder={t('aboutPage.form.movieNamePlaceholder', 'اكتب اسم الفيلم هنا...')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="movieType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300">{t('aboutPage.form.movieType', 'نوع الفيلم')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-black border-white/10 text-white">
                                                    <SelectValue placeholder={t('aboutPage.form.movieTypePlaceholder', 'اختر النوع...')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-[#111] border-white/10 text-white">
                                                <SelectItem value="Movie">{t('aboutPage.form.types.movie', 'فيلم')}</SelectItem>
                                                <SelectItem value="Anime">{t('aboutPage.form.types.anime', 'أنمي')}</SelectItem>
                                                <SelectItem value="Series">{t('aboutPage.form.types.series', 'مسلسل')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all">
                                {t('aboutPage.form.submit', 'إرسال الطلب عبر تلجرام')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>

        <footer className="text-center border-t border-white/10 pt-8 pb-12">
            <h3 className="text-2xl font-headline mb-4 text-white">{t('aboutPage.contact.title', 'تواصل معنا')}</h3>
            {telegramContact && <div className="flex items-center justify-center gap-4 group">
                <TelegramIcon className="h-8 w-8 text-red-600 group-hover:scale-110 transition-transform"/>
                <a href={`https://t.me/${telegramContact}`} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold tracking-wider hover:text-red-600 transition-colors text-white">
                    @{telegramContact}
                </a>
            </div>}
        </footer>
      </div>
    </div>
  );
                                                      }
