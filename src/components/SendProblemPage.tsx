import React, { useState } from 'react';
import { Send, ImagePlus, CheckCircle2, ArrowLeft, X } from 'lucide-react';
import { PageId } from '../types';

interface SendProblemPageProps {
  onSubmitProblem: (title: string, details: string, imageUrl?: string) => void;
  onNavigate: (page: PageId) => void;
}

export const SendProblemPage: React.FC<SendProblemPageProps> = ({
  onSubmitProblem,
  onNavigate,
}) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanDetails = details.trim();
    if (!cleanTitle && !cleanDetails) return;

    onSubmitProblem(
      cleanTitle || cleanDetails.slice(0, 60),
      cleanDetails || cleanTitle,
      imagePreview
    );
    setTitle('');
    setDetails('');
    setImagePreview(undefined);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition cursor-pointer mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Send Your Problem
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Describe your phone, app, or internet issue and send it directly.
          </p>
        </div>
      </div>

      {submitted && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Your problem has been sent and added to Pending Problems.</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('pending')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 cursor-pointer"
          >
            View Pending Problems
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5"
      >
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Problem Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSubmitted(false);
            }}
            placeholder="e.g., Phone running slow, Wi-Fi disconnecting..."
            className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Problem Details
          </label>
          <textarea
            rows={5}
            required
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              setSubmitted(false);
            }}
            placeholder="Type your problem details here..."
            className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Attach Photo (Optional)
          </label>
          {imagePreview ? (
            <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img
                src={imagePreview}
                alt="Attached problem screenshot"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(undefined)}
                aria-label="Remove image"
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full py-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer transition">
              <ImagePlus className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <span>Upload screenshot or photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() && !details.trim()}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-2 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send Problem</span>
          </button>
        </div>
      </form>
    </div>
  );
};
