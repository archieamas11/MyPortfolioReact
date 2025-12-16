import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useFormspark } from '@formspark/use-formspark'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRef } from 'react'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema } from './schema'
export default function ContactForm() {
  const turnstileRef = useRef<TurnstileInstance>(null)
  const [submit, submitting] = useFormspark({
    formId: import.meta.env.VITE_FORMSPARK_FORM_ID,
  })

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      full_name: '',
      email: '',
      subject: '',
      message: '',
      website: '',
      phone: '',
      turnstileToken: '',
    },
  })

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    try {
      if (values.website || values.phone) {
        toast.error('Bot detected. Submission blocked.')
        return
      }

      if (!values.turnstileToken) {
        toast.error('Please complete the verification.')
        return
      }

      await submit({
        full_name: values.full_name,
        email: values.email,
        subject: values.subject,
        message: values.message,
        'cf-turnstile-response': values.turnstileToken,
      })

      toast.success('Form submitted successfully!')

      turnstileRef.current?.reset()
      form.reset()
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Full Name" type="text" {...field} />
              </FormControl>
              <FormDescription className="sr-only">full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" type="email" {...field} />
              </FormControl>
              <FormDescription className="sr-only">Your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="!h-12 w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="freelance">Freelance Work</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                  <SelectItem value="project">Project Proposal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription className="sr-only">subject</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me about your project, idea, or how we can work together..."
                  className="h-30 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="sr-only">message</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot fields - hidden from real users */}
        <div className="sr-only" aria-hidden="true">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Leave blank)</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" tabIndex={-1} autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (Leave blank)</FormLabel>
                <FormControl>
                  <Input placeholder="" type="text" tabIndex={-1} autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Turnstile CAPTCHA */}
        <FormField
          control={form.control}
          name="turnstileToken"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex w-full justify-center overflow-scroll">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                    options={{
                      theme: 'auto',
                      size: 'flexible',
                      appearance: 'execute',
                    }}
                    onSuccess={(token) => {
                      field.onChange(token)
                    }}
                    onError={() => {
                      field.onChange('')
                      toast.error('Verification failed. Please try again.')
                    }}
                    onExpire={() => {
                      field.onChange('')
                      // toast.warning('Verification expired. Please verify again.')
                      console.log('Turnstile token expired')
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-5 w-full" variant={'glass'} size={'xl'} disabled={submitting}>
          {submitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  )
}
