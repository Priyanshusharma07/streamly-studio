import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home, Compass, Bookmark, Radio, Upload,
    ChevronRight, Settings, LogOut, Menu, X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const NAV = [
    { label: 'Home Feed', href: '/', icon: Home },
    { label: 'Discover', href: '/browse', icon: Compass },
    { label: 'Watchlist', href: '/profile?tab=saved', icon: Bookmark },
    { label: 'Live', href: '/live', icon: Radio },
];

const SUBSCRIPTIONS = [
    { name: 'Gaming Dynamics', color: '#00D4FF', dot: true },
    { name: 'Cinephile Hub', color: '#7C3AED', dot: false },
    { name: 'Tech Insider', color: '#F97316', dot: false },
];

interface SidebarProps {
    collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
    const { pathname } = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <aside
            className={cn(
                'flex flex-col h-full transition-all duration-300',
                collapsed ? 'w-16' : 'w-60',
            )}
            style={{ background: 'var(--gradient-sidebar)' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/[.05]">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm"
                    style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
                >
                    S
                </div>
                {!collapsed && (
                    <span className="font-bold text-base tracking-wide text-foreground">StreamHub</span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
                {NAV.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            to={href}
                            className={cn('sidebar-item', active && 'active')}
                            title={collapsed ? label : undefined}
                        >
                            <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                            {!collapsed && <span>{label}</span>}
                            {!collapsed && active && (
                                <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />
                            )}
                        </Link>
                    );
                })}

                {/* Subscriptions */}
                {!collapsed && isAuthenticated && (
                    <div className="pt-4">
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                            Subscriptions
                        </p>
                        {SUBSCRIPTIONS.map((s) => (
                            <button
                                key={s.name}
                                className="sidebar-item w-full text-left"
                            >
                                <span
                                    className="w-[30px] h-[30px] rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                                    style={{ background: s.color }}
                                >
                                    {s.name[0]}
                                </span>
                                <span className="flex-1 truncate">{s.name}</span>
                                {s.dot && (
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00D4FF' }} />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </nav>

            {/* Bottom: user */}
            <div className="border-t border-white/[.05] p-3">
                {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={user?.avatar} alt={user?.username} />
                            <AvatarFallback
                                className="text-xs font-bold"
                                style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
                            >
                                {user?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate">{user?.username}</p>
                                <p className="text-[10px] text-muted-foreground truncate">Premium Member</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="p-1.5 rounded-lg hover:bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                ) : (
                    !collapsed && (
                        <Link to="/login" className="btn-cyan w-full text-center text-xs py-2 rounded-lg block">
                            Sign In
                        </Link>
                    )
                )}
            </div>
        </aside>
    );
};
