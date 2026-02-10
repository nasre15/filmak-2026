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
        title: 'Movie Added',
        description: `"${values.title}" has been successfully added.`,
      });
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Adding Movie',
        description: result.error || 'Something went wrong.',
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <Link href="/" className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to Home</span>
        </Button>
      </Link>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Movie</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Cosmic Adventure" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A thrilling journey through space..."
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
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/video.mp4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Saving...' : 'Save Movie'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
