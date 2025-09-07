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
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import type { Note } from '@/types';
import { Skeleton } from './ui/skeleton';

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
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoadingTags(true);
    const q = query(collection(db, 'notes'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allTags = new Set<string>();
      snapshot.forEach((doc) => {
        const note = doc.data() as Note;
        if (note.tags) {
          note.tags.forEach((tag) => allTags.add(tag));
        }
      });
      setTags(Array.from(allTags).sort());
      setIsLoadingTags(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const handleNewNote = async () => {
    if (!user) return;
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        title: 'Untitled Note',
        content: '',
        tags: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
      });
      toast({ title: 'Created new note!' });
      router.push(`/notes/${docRef.id}`);
    } catch (error) {
      console.error('Error creating new note:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create note',
        description: 'Please try again later.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              className="w-full justify-start"
              onClick={handleNewNote}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              New Note
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
            {isLoadingTags ? (
              <div className="space-y-2 px-2">
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
              </div>
            ) : tags.length > 0 ? (
              tags.map((tag) => (
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
              ))
            ) : (
              <p className="px-2 text-xs text-muted-foreground">
                No tags yet. Add tags to your notes to see them here.
              </p>
            )}
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
