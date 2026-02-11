'use client';

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
    const telegramUrl = `https://t.me/+213795673705?text=${encodeURIComponent(text)}`;
    
    window.open(telegramUrl, '_blank');
  }

  const btcAddress = '1E9xnU6KRJ4VZRdW2csmEYkCmQZTMWfZCx';

  const handleCopy = () => {
    navigator.clipboard.writeText(btcAddress);
    toast({
      title: t('aboutPage.support.toastTitle', 'تم نسخ عنوان المحفظة بنجاح!'),
    });
  };

  return (
    <div dir={i18n.dir()} className="bg-[#050505] text-white min-h-screen p-4 sm:p-8">
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
            style={{ textShadow: '0 0 15px hsl(var(--primary))' }}
          >
            {t('aboutPage.title', 'من نحن')}
          </h1>
        </header>

        <section className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-lg md:text-xl text-foreground/80">
            {t('aboutPage.story', 'فلمك هي وجهتك الأولى لمتابعة أحدث الأفلام، الأنمي، والرياضة بجودة عالية وتجربة مستخدم فريدة.')}
          </p>
        </section>

        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border/50 text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Film className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="pt-4 text-2xl font-headline">{t('aboutPage.feature1.title', 'تنوع المحتوى')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('aboutPage.feature1.description', 'أفلام، أنمي، رياضة والمزيد.')}</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 text-center">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Rocket className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="pt-4 text-2xl font-headline">{t('aboutPage.feature2.title', 'سرعة البث')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('aboutPage.feature2.description', 'بث سريع بدون تقطيع.')}</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 text-center">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Smartphone className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="pt-4 text-2xl font-headline">{t('aboutPage.feature3.title', 'تجربة مستخدم')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('aboutPage.feature3.description', 'تصميم متجاوب لجميع الأجهزة.')}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-20">
            <Card className="bg-card border-border/50 w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-headline">{t('aboutPage.form.title', 'اطلب فيلمك')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="movieName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('aboutPage.form.movieName', 'اسم الفيلم')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('aboutPage.form.movieNamePlaceholder', 'اكتب اسم الفيلم هنا...')} {...field} />
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
                                        <FormLabel>{t('aboutPage.form.movieType', 'نوع الفيلم')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('aboutPage.form.movieTypePlaceholder', 'اختر النوع...')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Movie">{t('aboutPage.form.types.movie', 'فيلم')}</SelectItem>
                                                <SelectItem value="Anime">{t('aboutPage.form.types.anime', 'أنمي')}</SelectItem>
                                                <SelectItem value="Series">{t('aboutPage.form.types.series', 'مسلسل')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-12 text-lg">
                                {t('aboutPage.form.submit', 'إرسال الطلب عبر تلجرام')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </section>
        
        <section className="mb-20">
            <Card className="bg-card border-amber-500/50 w-full max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center justify-center gap-3">
                        <Bitcoin className="h-8 w-8 text-amber-500" />
                        <CardTitle className="text-center text-3xl font-headline text-amber-400">{t('aboutPage.support.title', 'ادعم المشروع')}</CardTitle>
                    </div>
                    <CardDescription className="text-center !mt-2 text-muted-foreground/80">
                        {t('aboutPage.support.description', 'لدعم استمرار المنصة والمحتوى المجاني')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <div className="relative w-40 h-40 bg-white p-2 rounded-lg">
                        <Image
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=1E9xnU6KRJ4VZRdW2csmEYkCmQZTMWfZCx"
                            alt="Bitcoin QR Code"
                            width={150}
                            height={150}
                        />
                    </div>
                    <div className="w-full space-y-2">
                        <p className="text-center text-sm text-muted-foreground">
                            {t('aboutPage.support.walletDescription', 'أو انسخ عنوان المحفظة التالي:')}
                        </p>
                        <div className="flex items-center gap-2 p-3 rounded-md bg-black/50 w-full">
                            <code className="font-mono text-sm sm:text-base break-all text-amber-400 flex-1 text-center" dir="ltr">
                                {btcAddress}
                            </code>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                className="text-white/70 hover:text-white"
                            >
                                <Copy className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>

        <footer className="text-center border-t border-border/20 pt-8">
            <h3 className="text-2xl font-headline mb-4">{t('aboutPage.contact.title', 'تواصل معنا')}</h3>
            <div className="flex items-center justify-center gap-4">
                <TelegramIcon className="h-8 w-8 text-primary"/>
                <a href="https://t.me/+213795673705" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold tracking-wider hover:text-primary transition-colors">
                    +213795673705
                </a>
            </div>
        </footer>
      </div>
    </div>
  );
}
