import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconTruck,
  IconUserShield,
  IconUsers,
  IconLock,
  IconUserCog,
  IconLogout,
  IconMenu2,
  IconLicense,
  IconFileUpload,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

const iconsMap: Record<string, JSX.Element> = {
  "Dashboard": <IconLayoutDashboard size={18} />,
  "Pengaturan": <IconUserCog size={18} />,
  "User Management": <IconUsers size={18} />,
  "Profile Users": <IconApps size={18} />,
  "Authentication": <IconUserShield size={18} />,
  "Users": <IconUsers size={18} />,
  "Keluar": <IconLogout size={18} />,
  "Analysis": <IconChartHistogram size={18} />,
  "Extra Components": <IconComponents size={18} />,
  "Error Pages": <IconExclamationCircle size={18} />,
  "Settings": <IconSettings size={18} />,
  "Data Pendapatan": <IconHexagonNumber1 size={18} />,
  "Sign In (Box)": <IconHexagonNumber2 size={18} />,
  "Sign Up": <IconHexagonNumber3 size={18} />,
  "Forgot Password": <IconHexagonNumber4 size={18} />,
  "OTP": <IconHexagonNumber5 size={18} />,
  "Not Found": <IconError404 size={18} />,
  "Internal Server Error": <IconServerOff size={18} />,
  "Maintenance Error": <IconBarrierBlock size={18} />,
  "Trucks": <IconTruck size={18} />,
  "Detail RBAC Users": <IconUserShield size={18} />,
  "List Menu": <IconMenu2 size={18} />,
  "List Semua Permission": <IconLicense size={18} />,
  "List Semua Roles": <IconLicense size={18} />,
  "Upload Dokumen": <IconFileUpload size={18} />,
};

interface Menu {
  nama_menu: string;
  sub_menus: Array<{
    nama_sub_menu: string | null;
    url: string;
    is_menu: boolean;
  }>;
}

export function generateSidelinks(userAuthorization: any[] | null) {
  if (!userAuthorization || !Array.isArray(userAuthorization)) {
    return [];
  }

  return userAuthorization.flatMap(role => role.menus.map((menu: Menu) => {
    const subMenus = menu.sub_menus
      .filter(sub => sub.nama_sub_menu !== null && sub.is_menu)
      .map(sub => ({
        title: sub.nama_sub_menu ?? menu.nama_menu,
        label: '',
        href: sub.url,
        icon: iconsMap[sub.nama_sub_menu ?? menu.nama_menu],
      }));

    const mainLink: SideLink = {
      title: menu.nama_menu,
      label: '',
      href: subMenus.length === 0 ? menu.sub_menus[0]?.url : '',
      icon: iconsMap[menu.nama_menu],
    };

    if (subMenus.length > 0) {
      mainLink.sub = subMenus;
    }

    return mainLink;
  }));
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Tasks',
    label: '3',
    href: '/tasks',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Chats',
    label: '9',
    href: '/chats',
    icon: <IconMessages size={18} />,
  },
  {
    title: 'Apps',
    label: '',
    href: '/apps',
    icon: <IconApps size={18} />,
  },
  {
    title: 'Authentication',
    label: '',
    href: '',
    icon: <IconUserShield size={18} />,
    sub: [
      {
        title: 'Sign In (email + password)',
        label: '',
        href: '/sign-in',
        icon: <IconHexagonNumber1 size={18} />,
      },
      {
        title: 'Sign In (Box)',
        label: '',
        href: '/sign-in-2',
        icon: <IconHexagonNumber2 size={18} />,
      },
      {
        title: 'Sign Up',
        label: '',
        href: '/sign-up',
        icon: <IconHexagonNumber3 size={18} />,
      },
      {
        title: 'Forgot Password',
        label: '',
        href: '/forgot-password',
        icon: <IconHexagonNumber4 size={18} />,
      },
      {
        title: 'OTP',
        label: '',
        href: '/otp',
        icon: <IconHexagonNumber5 size={18} />,
      },
    ],
  },
  {
    title: 'Users',
    label: '',
    href: '/users',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'Requests',
    label: '10',
    href: '/requests',
    icon: <IconRouteAltLeft size={18} />,
    sub: [
      {
        title: 'Trucks',
        label: '9',
        href: '/trucks',
        icon: <IconTruck size={18} />,
      },
      {
        title: 'Cargos',
        label: '',
        href: '/cargos',
        icon: <IconBoxSeam size={18} />,
      },
    ],
  },
  {
    title: 'Analysis',
    label: '',
    href: '/analysis',
    icon: <IconChartHistogram size={18} />,
  },
  {
    title: 'Extra Components',
    label: '',
    href: '/extra-components',
    icon: <IconComponents size={18} />,
  },
  {
    title: 'Error Pages',
    label: '',
    href: '',
    icon: <IconExclamationCircle size={18} />,
    sub: [
      {
        title: 'Not Found',
        label: '',
        href: '/404',
        icon: <IconError404 size={18} />,
      },
      {
        title: 'Internal Server Error',
        label: '',
        href: '/500',
        icon: <IconServerOff size={18} />,
      },
      {
        title: 'Maintenance Error',
        label: '',
        href: '/503',
        icon: <IconBarrierBlock size={18} />,
      },
      {
        title: 'Unauthorised Error',
        label: '',
        href: '/401',
        icon: <IconLock size={18} />,
      },
    ],
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]