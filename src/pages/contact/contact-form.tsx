import { useFormspark } from '@formspark/use-formspark'
import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
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
import { useToast } from '@/components/ui/toast/toast-provider'
import { contactSchema } from './schema'

export default function ContactForm() { 
  const turnstileRef = useRef<TurnstileInstance>(null)
  const { showToast } = useToast()
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
        showToast({
          variant: 'error',
          description: "We couldn't process your submission. Please try again.",
        })
        return
      }

      if (!values.turnstileToken) {
        showToast({
          variant: 'error',
          description: 'Please complete the verification above.',
        })
        return
      }

      await submit({
        full_name: values.full_name,
        email: values.email,
        subject: values.subject,
        message: values.message,
        'cf-turnstile-response': values.turnstileToken,
      })

      showToast({
        variant: 'success',
        description: 'Message sent. Thank you for reaching out.',
      })

      turnstileRef.current?.reset()
      form.reset()
    } catch {
      showToast({
        variant: 'error',
        description: "We couldn't send your message. Please try again in a moment.",
      })
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" type="text" {...field} />
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
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" type="email" {...field} />
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
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger className="h-12! w-full">
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
                  className="h-30 resize-none"
                  placeholder="Tell me about your project, idea, or how we can work together..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="sr-only">message</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot fields - hidden from real users */}
        <div aria-hidden="true" className="sr-only">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Leave blank)</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="" tabIndex={-1} type="text" {...field} />
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
                  <Input autoComplete="off" placeholder="" tabIndex={-1} type="text" {...field} />
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
                <div className="flex w-full justify-center overflow-x-auto">
                  <Turnstile
                    onError={() => {
                      field.onChange('')
                      showToast({
                        variant: 'error',
                        description: 'Verification failed. Please try again.',
                      })
                    }}
                    onExpire={() => {
                      field.onChange('')
                      showToast({
                        variant: 'error',
                        description: 'Verification expired. Please complete it again.',
                      })
                    }}
                    onSuccess={(token) => {
                      field.onChange(token)
                    }}
                    options={{
                      theme: 'auto',
                      size: 'flexible',
                      appearance: 'execute',
                    }}
                    ref={turnstileRef}
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-5 w-full" disabled={submitting} size={'xl'} type="submit" variant={'glass'}>
          {submitting ? 'Sending...' : 'Send message'}
        </Button>
      </form>
    </Form>
  )
}
