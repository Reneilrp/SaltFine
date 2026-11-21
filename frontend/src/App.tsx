import { Suspense, useEffect } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import TopNav from './components/layout/TopNav'
import { LoadingState } from './components/ui/PageState'
import { ToastProvider } from './components/ui/Toast'
import { APP_NAME } from './config'
import { useHashRoute } from './hooks/useHashRoute'
import { DEFAULT_PAGE_ID, PAGE_IDS, PAGES } from './navigation'

export default function App() {
  const [route, navigate] = useHashRoute(PAGE_IDS, DEFAULT_PAGE_ID)
  const page = PAGES.find((item) => item.id === route) ?? PAGES[0]
  const Page = page.component

  useEffect(() => {
    document.title = `${page.label} · ${APP_NAME}`
  }, [page.label])

  return (
    <ToastProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-panel focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      {/* Wide screens (>= 1280px): fixed sidebar. Tablets: tab bar across the top. */}
      <Sidebar pages={PAGES} activeId={page.id} />

      <div className="flex min-h-dvh flex-col xl:pl-64">
        <TopNav pages={PAGES} activeId={page.id} />
        <Header title={page.label} connectedLabel={page.status} />

        <main id="main" className="flex-1 px-4 py-5 sm:px-5 lg:px-8 lg:py-7">
          <div className="mx-auto w-full max-w-[1480px]">
            <Suspense fallback={<LoadingState title="Loading page…" />}>
              <Page onNavigate={navigate} />
            </Suspense>
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}
