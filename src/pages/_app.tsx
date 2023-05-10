import { useMemo } from 'react'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify'

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        }
      }),
    [prefersDarkMode],
  )

  return (
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <CssBaseline />
            <ToastContainer theme={ prefersDarkMode ? 'dark' : 'light' } />
            <Component {...pageProps} />
          </QueryClientProvider>
        </ThemeProvider>
      </RecoilRoot>
  )
}
