import * as I from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import type { ComponentProps, ComponentType } from 'react';

// Hugeicons stroke-rounded (free set) behind the icon names the starter kit already uses.
type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, 'icon'>;
export type AppIcon = ComponentType<IconProps>;

const make = (icon: IconSvgElement): AppIcon => {
    const C = (props: IconProps) => (
        <HugeiconsIcon icon={icon} strokeWidth={1.75} {...props} />
    );
    return C;
};

export const Check = make(I.Tick02Icon);
export const CheckIcon = Check;
export const ChevronDownIcon = make(I.ArrowDown01Icon);
export const ChevronRight = make(I.ArrowRight01Icon);
export const ChevronRightIcon = ChevronRight;
export const ChevronsUpDown = make(I.UnfoldMoreIcon);
export const CircleIcon = make(I.CircleIcon);
export const Eye = make(I.ViewIcon);
export const EyeOff = make(I.ViewOffSlashIcon);
export const LayoutGrid = make(I.DashboardSquare02Icon);
export const Loader2Icon = make(I.Loading03Icon);
export const LogOut = make(I.Logout01Icon);
export const Menu = make(I.Menu01Icon);
export const MoreHorizontal = make(I.MoreHorizontalIcon);
export const PanelLeftCloseIcon = make(I.SidebarLeft01Icon);
export const PanelLeftOpenIcon = make(I.SidebarLeftIcon);
export const Search = make(I.Search01Icon);
export const ShieldCheck = make(I.ShieldKeyIcon);
export const Trash2 = make(I.Delete02Icon);
export const XIcon = make(I.Cancel01Icon);

// App screens
export const Plus = make(I.PlusSignIcon);
export const Pencil = make(I.PencilEdit02Icon);
export const Download = make(I.Download04Icon);
export const Upload = make(I.Upload04Icon);
export const UserIcon = make(I.UserIcon);
export const Users = make(I.UserGroupIcon);
export const Info = make(I.InformationCircleIcon);
export const MessageIcon = make(I.Comment01Icon);
export const Layers = make(I.Layers01Icon);
export const Phone = make(I.CallIcon);
export const ArrowLeft = make(I.ArrowLeft01Icon);
export const Login = make(I.Login01Icon);
export const UserAdd = make(I.UserAdd01Icon);

export const Server = make(I.ServerStack01Icon);
export const Device = make(I.LaptopIcon);
export const Ticket = make(I.Ticket01Icon);
export const Crown = make(I.CrownIcon);
export const Database = make(I.Database01Icon);
export const Image = make(I.Image01Icon);

// menu.icon stores Boxicons classes ("bx bxs-dashboard"); map the ones in use, fall back to a generic dot.
const bxMap: Record<string, AppIcon> = {
    'bxs-dashboard': LayoutGrid,
    'bxs-user-circle': UserIcon,
    'bxs-user-account': Users,
    'bx-menu': Menu,
    'bx-crown': Crown,
    'bxs-data': Database,
    'bxl-algolia': Server,
    'bxl-facebook-circle': Device,
    'bx-chat': MessageIcon,
    'bx-image-add': Ticket,
    'bx-download': Download,
};

export function menuIcon(classes: string | null | undefined): AppIcon {
    const key = classes?.split(/\s+/).find((c) => bxMap[c]);
    return key ? bxMap[key] : CircleIcon;
}

export { I as Hugeicons, make as icon };
