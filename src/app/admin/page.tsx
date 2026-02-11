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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addMovie } from './actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  videoUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function AdminPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      videoUrl: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await addMovie(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: t('adminPage.movieAdded'),
        description: t('adminPage.movieAddedDescription', { title: values.title }),
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: t('adminPage.errorAddingMovie'),
        description: result.error || 'Something went wrong.',
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Link href="/" className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">{t('adminPage.backToHome')}</span>
        </Button>
      </Link>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{t('adminPage.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('adminPage.movieTitle')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('adminPage.movieTitlePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('adminPage.description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('adminPage.descriptionPlaceholder')}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('adminPage.videoUrl')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('adminPage.videoUrlPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? t('adminPage.saving') : t('adminPage.save')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
