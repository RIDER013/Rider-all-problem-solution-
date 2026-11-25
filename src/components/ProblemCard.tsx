import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageCircle,
  Send,
  Smartphone,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { PendingStatus, ProblemItem } from '../types';

interface ProblemCardProps {
  problem: ProblemItem;
  indexNumber: number;
  mode: 'home' | 'pending' | 'user';
  currentUserName: string;
  onToggleLike: (id: string) => void;
  onAddComment: (id: string, text: string) => void;
  onChangePendingStatus?: (id: string, status: PendingStatus) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  indexNumber,
  mode,
  currentUserName,
  onToggleLike,
  onAddComment,
  onChangePendingStatus,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [imgFailed, setImgFailed] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onAddComment(problem.id, trimmed);
    setCommentText('');
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
      {/* Card Header */}
      <div className="px-5 pt-5 pb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono-num text-sm font-bold text-sky-600 dark:text-sky-400 shrink-0">
              {indexNumber}.
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              Problem {indexNumber}: {problem.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 pl-6 text-xs text-slate-500 dark:text-slate-400">
            <span>{problem.createdAt}</span>
            {mode === 'pending' && problem.pendingStatus && (
              <>
                <span aria-hidden="true">·</span>
                <span
                  className={`font-semibold inline-flex items-center gap-1 ${
                    problem.pendingStatus === 'working'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {problem.pendingStatus === 'working' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {problem.pendingStatus === 'working' ? 'Working' : 'Pending'}
                </span>
              </>
            )}
            {mode === 'user' && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Working
                </span>
              </>
            )}
          </div>
        </div>

        {/* Status Selector for Pending Problems: Pending / Working */}
        {mode === 'pending' && onChangePendingStatus && (
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => onChangePendingStatus(problem.id, 'pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
                problem.pendingStatus === 'pending'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => onChangePendingStatus(problem.id, 'working')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap cursor-pointer ${
                problem.pendingStatus === 'working'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Working
            </button>
          </div>
        )}
      </div>

      {/* Demo Problem Image */}
      <div className="px-5">
        {problem.imageUrl && !imgFailed ? (
          <div className="w-full aspect-16/9 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
            <img
              src={problem.imageUrl}
              alt={problem.imageAlt}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-16/9 rounded-xl bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
            <Smartphone className="w-8 h-8 text-sky-500 dark:text-sky-400" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 px-4 text-center">
              {problem.title}
            </span>
          </div>
        )}
      </div>

      {/* Solution Section + small sky-blue "more.." */}
      <div className="px-5 pt-4 pb-4 space-y-2.5">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Solution
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {problem.solutionShort}{' '}
          {problem.solutionFull.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition cursor-pointer inline whitespace-nowrap"
            >
              {expanded ? 'less' : 'more..'}
            </button>
          )}
        </p>

        {expanded && problem.solutionFull.length > 0 && (
          <ol className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
            {problem.solutionFull.map((step, i) => (
              <li
                key={i}
                className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
              >
                <span className="font-mono-num text-xs font-semibold text-sky-600 dark:text-sky-400 mt-0.5 shrink-0">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Like & Comment Action Bar */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
        <button
          type="button"
          onClick={() => onToggleLike(problem.id)}
          className={`inline-flex items-center gap-2 text-xs font-semibold transition cursor-pointer py-1 ${
            problem.likedByMe
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <ThumbsUp
            className={`w-4 h-4 ${
              problem.likedByMe
                ? 'fill-sky-600 text-sky-600 dark:fill-sky-400 dark:text-sky-400'
                : ''
            }`}
          />
          <span>Like</span>
          <span className="font-mono-num text-slate-500 dark:text-slate-400">
            {problem.likes}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className={`inline-flex items-center gap-2 text-xs font-semibold transition cursor-pointer py-1 ${
            showComments
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
          <span className="font-mono-num text-slate-500 dark:text-slate-400">
            {problem.comments.length}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {problem.comments.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No comments yet. Write the first comment below.
            </p>
          ) : (
            <div className="space-y-2.5">
              {problem.comments.map((c) => (
                <div
                  key={c.id}
                  className="text-xs bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3.5 py-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {c.author}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {c.createdAt}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Comment as ${currentUserName}...`}
              className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              aria-label="Post comment"
              className="px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
