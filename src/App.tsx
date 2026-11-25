import React, { useState, useEffect } from 'react';
import {
  Home,
  Clock,
  FileText,
  Send,
  MessageSquare,
  Sun,
  Moon,
} from 'lucide-react';
import {
  PageId,
  PendingStatus,
  ProblemItem,
  UserAccount,
} from './types';
import {
  DEFAULT_AVATAR_URL,
  DEMO_HOME_PROBLEMS,
  DEMO_PENDING_PROBLEMS,
  DEMO_USER_PROBLEMS,
} from './data/demoProblems';
import { AuthModal } from './components/AuthModal';
import { ProblemCard } from './components/ProblemCard';
import { SendProblemPage } from './components/SendProblemPage';
import { LiveAgentChat } from './components/LiveAgentChat';

const HOME_KEY = 'rider_home_problems_v2';
const PENDING_KEY = 'rider_pending_problems_v2';
const USER_PROBLEMS_KEY = 'rider_user_problems_v3';
const SESSION_KEY = 'rider_active_user';
const THEME_KEY = 'rider_theme_mode';

function loadList(key: string, fallback: ProblemItem[]): ProblemItem[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [theme, setTheme] = useState<'day' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'dark' ? 'dark' : 'day';
    } catch {
      return 'day';
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore storage quota errors
    }
  }, [theme]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [homeProblems, setHomeProblems] = useState<ProblemItem[]>(() =>
    loadList(HOME_KEY, DEMO_HOME_PROBLEMS)
  );
  const [pendingProblems, setPendingProblems] = useState<ProblemItem[]>(() =>
    loadList(PENDING_KEY, DEMO_PENDING_PROBLEMS)
  );
  const [userProblems, setUserProblems] = useState<ProblemItem[]>(() =>
    loadList(USER_PROBLEMS_KEY, DEMO_USER_PROBLEMS)
  );

  const displayName = currentUser ? currentUser.name : 'Guest User';
  const displayAvatar = currentUser?.avatarUrl || DEFAULT_AVATAR_URL;

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  };

  const handleUpdateAvatar = (avatarUrl: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, avatarUrl };
    setCurrentUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateCollection = (
    setter: React.Dispatch<React.SetStateAction<ProblemItem[]>>,
    storageKey: string,
    updater: (prev: ProblemItem[]) => ProblemItem[]
  ) => {
    setter((prev) => {
      const next = updater(prev);
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const handleToggleLike = (section: 'home' | 'pending' | 'user', id: string) => {
    const toggle = (list: ProblemItem[]) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              likedByMe: !item.likedByMe,
              likes: item.likedByMe ? Math.max(0, item.likes - 1) : item.likes + 1,
            }
          : item
      );

    if (section === 'home') updateCollection(setHomeProblems, HOME_KEY, toggle);
    if (section === 'pending') updateCollection(setPendingProblems, PENDING_KEY, toggle);
    if (section === 'user') updateCollection(setUserProblems, USER_PROBLEMS_KEY, toggle);
  };

  const handleAddComment = (
    section: 'home' | 'pending' | 'user',
    id: string,
    text: string
  ) => {
    const newComment = {
      id: Date.now().toString(),
      author: displayName,
      text,
      createdAt: 'Just now',
    };

    const append = (list: ProblemItem[]) =>
      list.map((item) =>
        item.id === id
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      );

    if (section === 'home') updateCollection(setHomeProblems, HOME_KEY, append);
    if (section === 'pending') updateCollection(setPendingProblems, PENDING_KEY, append);
    if (section === 'user') updateCollection(setUserProblems, USER_PROBLEMS_KEY, append);
  };

  const handleChangePendingStatus = (id: string, status: PendingStatus) => {
    updateCollection(setPendingProblems, PENDING_KEY, (list) =>
      list.map((item) =>
        item.id === id ? { ...item, pendingStatus: status } : item
      )
    );
  };

  const handleSubmitNewProblem = (
    title: string,
    details: string,
    imageUrl?: string
  ) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const baseId = Date.now().toString();

    const pendingItem: ProblemItem = {
      id: `pending-${baseId}`,
      number: pendingProblems.length + 1,
      label: `Problem ${pendingProblems.length + 1}`,
      title,
      imageUrl,
      imageAlt: title,
      solutionShort: details,
      solutionFull: [
        'Our support team has logged your problem.',
        'You will see step-by-step troubleshooting updates right here once reviewed.',
      ],
      likes: 0,
      likedByMe: false,
      comments: [],
      createdAt: `Today · ${timestamp}`,
      section: 'pending',
      pendingStatus: 'pending',
      userEmail: currentUser?.email,
    };

    const userItem: ProblemItem = {
      ...pendingItem,
      id: `user-${baseId}`,
      number: userProblems.length + 1,
      label: `Problem ${userProblems.length + 1}`,
      section: 'user',
      pendingStatus: undefined,
      userFeedback: 'working',
    };

    updateCollection(setPendingProblems, PENDING_KEY, (prev) => [
      pendingItem,
      ...prev,
    ]);
    updateCollection(setUserProblems, USER_PROBLEMS_KEY, (prev) => [
      userItem,
      ...prev,
    ]);
  };

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Non-sticky Transparent Top User Ribbon — stays at top, does not scroll down with page */}
      <header className="relative bg-transparent">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            aria-label={`Profile: ${displayName}`}
            className="inline-flex items-center gap-3 py-1.5 pr-3 rounded-full hover:bg-slate-900/5 dark:hover:bg-white/10 transition cursor-pointer"
          >
            <img
              src={displayAvatar}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200/80 dark:border-slate-700 shadow-xs"
            />
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {displayName}
            </span>
          </button>

          {/* Day / Dark Mode Switcher */}
          <div
            role="group"
            aria-label="Theme mode"
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0"
          >
            <button
              type="button"
              onClick={() => setTheme('day')}
              aria-pressed={theme === 'day'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                theme === 'day'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Day</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                theme === 'dark'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Sidebar + Center Scrollable Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar below User Ribbon */}
        <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-800 px-3 py-3 md:py-4 shrink-0 bg-white dark:bg-slate-950 transition-colors">
          <div className="px-3.5 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 hidden md:block">
            <span className="text-base font-extrabold tracking-wider text-slate-900 dark:text-slate-100">
              RIDER
            </span>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                activePage === 'home'
                  ? 'bg-slate-900 dark:bg-sky-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('pending')}
              className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                activePage === 'pending'
                  ? 'bg-slate-900 dark:bg-sky-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Pending Problems</span>
              </span>
              <span className="font-mono-num text-xs opacity-75">
                {pendingProblems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('your-problems')}
              className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                activePage === 'your-problems'
                  ? 'bg-slate-900 dark:bg-sky-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Your Problems</span>
              </span>
              <span className="font-mono-num text-xs opacity-75">
                {userProblems.length}
              </span>
            </button>
          </nav>
        </aside>

        {/* Center Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 py-6 pb-28 md:pr-24">
          {activePage === 'home' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {homeProblems.map((problem, idx) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  indexNumber={idx + 1}
                  mode="home"
                  currentUserName={displayName}
                  onToggleLike={(id) => handleToggleLike('home', id)}
                  onAddComment={(id, text) => handleAddComment('home', id, text)}
                />
              ))}
            </div>
          )}

          {activePage === 'pending' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Pending Problems
                </h1>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Working · Pending
                </span>
              </div>

              {pendingProblems.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No pending problems yet.
                </p>
              ) : (
                pendingProblems.map((problem, idx) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    indexNumber={idx + 1}
                    mode="pending"
                    currentUserName={displayName}
                    onToggleLike={(id) => handleToggleLike('pending', id)}
                    onAddComment={(id, text) =>
                      handleAddComment('pending', id, text)
                    }
                    onChangePendingStatus={handleChangePendingStatus}
                  />
                ))
              )}
            </div>
          )}

          {activePage === 'your-problems' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Your Problems
                </h1>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Working
                </span>
              </div>

              {userProblems.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No problems submitted yet.
                </p>
              ) : (
                userProblems.map((problem, idx) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    indexNumber={idx + 1}
                    mode="user"
                    currentUserName={displayName}
                    onToggleLike={(id) => handleToggleLike('user', id)}
                    onAddComment={(id, text) => handleAddComment('user', id, text)}
                  />
                ))
              )}
            </div>
          )}

          {activePage === 'send-problem' && (
            <div className="max-w-2xl mx-auto">
              <SendProblemPage
                onSubmitProblem={handleSubmitNewProblem}
                onNavigate={navigateTo}
              />
            </div>
          )}

          {activePage === 'live-agent' && (
            <div className="max-w-2xl mx-auto">
              <LiveAgentChat onNavigate={navigateTo} />
            </div>
          )}
        </main>
      </div>

      {/* Right-Side Stacked Icon Buttons: Send Your Problem (above) + Chat with Live Agent (below) */}
      <div className="fixed right-4 sm:right-6 bottom-6 z-40 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => navigateTo('send-problem')}
          title="Send Your Problem"
          aria-label="Send Your Problem"
          className={`group relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer ${
            activePage === 'send-problem'
              ? 'bg-sky-600 text-white ring-4 ring-sky-200 dark:ring-sky-900'
              : 'bg-sky-500 hover:bg-sky-600 text-white'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-14 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-md">
            Send Your Problem
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('live-agent')}
          title="Chat with Live Agent"
          aria-label="Chat with Live Agent"
          className={`group relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer ${
            activePage === 'live-agent'
              ? 'bg-slate-900 dark:bg-slate-800 text-sky-400 ring-4 ring-slate-200 dark:ring-slate-700'
              : 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-sky-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute right-14 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-md">
            Chat with Live Agent
          </span>
        </button>
      </div>

      {/* Profile / Log In / Create Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onUpdateAvatar={handleUpdateAvatar}
        onLogout={handleLogout}
      />
    </div>
  );
}
