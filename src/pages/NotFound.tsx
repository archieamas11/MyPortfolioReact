import { ArrowLeft, Home, SearchX } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/pages/Footer'

export default function NotFound() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = location.pathname || '/'

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute -bottom-40 left-1/2 h-96 w-2xl -translate-x-1/2 rounded-full blur-3xl" />
        <div className="to-background/60 absolute inset-0 bg-linear-to-b from-transparent via-transparent" />
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <Card className="bg-effect glass border-border/50 bg-card/60 w-full max-w-xl backdrop-blur">
          <CardHeader className="gap-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <SearchX className="text-muted-foreground size-5" />
                Page not found
              </CardTitle>
            </div>

            <div className="relative">
              <p className="font-oswald from-primary to-accent bg-linear-to-b bg-clip-text text-6xl font-bold tracking-widest text-transparent sm:text-7xl">
                404
              </p>
              <span className="from-primary/10 to-accent/30 absolute inset-y-0 left-0 -z-10 w-40 bg-linear-to-b opacity-70 blur-xl" />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              The page you’re trying to reach doesn’t exist (or was moved).
            </p>

            <div className="text-muted-foreground text-sm">
              Requested path:{' '}
              <code className="bg-muted/40 rounded px-2 py-1 font-mono text-xs">{pathname}</code>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="glass" className="bg-accent/30 w-full sm:w-auto" onClick={() => navigate('/')}>
                <Home />
                Go home
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleGoBack}>
                <ArrowLeft />
                Go back
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
