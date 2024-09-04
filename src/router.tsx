import { createBrowserRouter, Navigate } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },

  // Main routes
  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    // errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'tasks',
        lazy: async () => ({
          Component: (await import('@/pages/tasks')).default,
        }),
      },
      {
        path: 'chats',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
      {
        path: 'apps',
        lazy: async () => ({
          Component: (await import('@/pages/apps')).default,
        }),
      },
      {
        path: 'rbac',
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            element: <Navigate to="/rbac/list-menu" replace />,
          },
          {
            path: 'list-menu',
            lazy: async () => ({
              Component: (await import('@/pages/users/list-menu.page')).default,
            }),
          },
          {
            path: 'list-permission',
            lazy: async () => ({
              Component: (await import('@/pages/users/list-permission.page')).default,
            }),
          },
        ]
      },
      {
        path: 'users',
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            element: <Navigate to="/users/list-users" replace />,
          },
          {
            path: 'detail-rbac',
            lazy: async () => ({
              Component: (await import('@/pages/users/detail-rbac.page')).default,
            }),
          },
          {
            path: 'list-users',
            lazy: async () => ({
              Component: (await import('@/pages/users/user-management')).default,
            }),
          },
          {
            path: 'update/password',
            lazy: async () => ({
              Component: (await import('@/pages/users/update-password.page')).default,
            }),
          }
        ]
      },
      {
        path: 'analysis',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
      {
        path: 'extra-components',
        lazy: async () => ({
          Component: (await import('@/pages/extra-components')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            path: 'account',
            lazy: async () => ({
              Component: (await import('./pages/settings/account')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications')).default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example')).default,
            }),
            errorElement: <GeneralError className='h-[50svh]' minimal />,
          },
        ],
      },
      {
        path: 'data',
        children: [
          {
            path: 'kontribusi',
            lazy: async () => ({
              Component: (await import('./pages/data/kontribusi')).default,
            }),
          },
          {
            path: 'peningkatan',
            lazy: async () => ({
              Component: (await import('./pages/data/peningkatan')).default,
            }),
          },
          {
            path: 'Peringkat',
            lazy: async () => ({
              Component: (await import('./pages/data/peringkat')).default,
            }),
          },
        ],
      },
    ],
  },

  // Error routes
  // { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router