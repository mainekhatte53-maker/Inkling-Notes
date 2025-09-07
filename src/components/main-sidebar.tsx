'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Lightbulb,
  LogOut,
  Pen,
  PlusCircle,
  Tag,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { SheetTitle } from './ui/sheet';

const Logo = () => (
  <Link href="/dashboard" className="flex items-center gap-2">
    <div className="relative">
      <Lightbulb className="w-8 h-8 text-primary" />
      <Pen className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground fill-primary" />
    </div>
    <span className="text-xl font-bold tracking-tight">Inkling Notes</span>
  </Link>
);

export function MainSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  // Dummy tags - replace with actual data fetching
  const tags = ['productivity', 'ideas', 'work', 'learning'];

  return (
    <Sidebar>
      <SheetTitle className="sr-only">Main Navigation</SheetTitle>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button className="w-full justify-start" asChild>
              <Link href="/notes/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Note
              </Link>
            </Button>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dashboard"
              isActive={pathname === '/dashboard'}
              asChild
            >
              <Link href="/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarGroup>
            <SidebarGroupLabel>Tags</SidebarGroupLabel>
            {tags.map((tag) => (
              <SidebarMenuButton
                key={tag}
                size="sm"
                asChild
                className="text-muted-foreground"
                isActive={pathname === `/tags/${tag}`}
              >
                <Link href={`/dashboard?tag=${tag}`}>
                  <Tag className="text-inherit" />
                  <span>{tag}</span>
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? ''} />
                <AvatarFallback>
                  {user?.displayName?.charAt(0).toUpperCase() ||
                    user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start overflow-hidden">
                <span className="truncate font-medium">{user?.displayName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
