// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Router } from 'next/router'

// ** Store Imports
import { Provider } from 'react-redux'
import { store } from 'src/stores'

// ** Loader Import
import NProgress from 'nprogress'

// ** Config Imports
import { defaultACLObj } from 'src/configs/acl'
import 'src/configs/i18n'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Contexts
import { AuthProvider } from 'src/contexts/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/contexts/SettingsContext'

// ** Global css styles
import 'src/styles/globals.scss'

// Components
import AuthGuard from 'src/components/auth/AuthGuard'
import GuestGuard from 'src/components/auth/GuestGuard'
import FallbackSpinner from 'src/components/fall-back'
import ReactHotToast from 'src/components/react-hot-toast'
import AclGuard from 'src/components/auth/AclGuard'

// ** Axios
import { AxiosInterceptor } from 'src/helpers/axios'

// ** Hooks
import { useSettings } from 'src/hooks/useSettings'

// ** Theme
import ThemeComponent from 'src/theme/ThemeComponent'

// ** Layout
import UserLayout from 'src/view/layout/UserLayout'
import NoGuard from 'src/components/auth/NoGuard'

// ** Layout

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <NoGuard fallback={<FallbackSpinner />}>{children}</NoGuard>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}

export default function App(props: ExtendedAppProps) {
  const { Component, pageProps } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { settings } = useSettings()

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  // check user login ? in page : back page login
  const authGuard = Component.authGuard ?? true

  // user don't login into page (this page don't login) and user logged in then don't back page login until logout
  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  const permissions = Component.permissions

  const toastOptions = {
    success: {
      className: 'react-hot-toast',
      style: {
        background: '#DDF6E8'
      }
    },
    error: {
      className: 'react-hot-toast',
      style: {
        background: '#FDE4D5'
      }
    }
  }

  return (
    <Provider store={store}>
      <Head>
        <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
        <meta name='description' />
        <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <AuthProvider>
        <AxiosInterceptor>
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    <Guard authGuard={authGuard} guestGuard={guestGuard}>
                      <AclGuard
                        permissions={permissions}
                        aclAbilities={aclAbilities}
                        guestGuard={guestGuard}
                        authGuard={authGuard}
                      >
                        {getLayout(<Component {...pageProps} />)}
                      </AclGuard>
                    </Guard>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={toastOptions} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        </AxiosInterceptor>
      </AuthProvider>
    </Provider>
  )
}
