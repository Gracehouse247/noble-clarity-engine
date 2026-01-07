
import * as React from 'react';
import { X, Star, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { useUser } from '../contexts/NobleContext';
import ImageSEO from './ImageSEO';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FunctionComponent<ReviewModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, submitReview } = useUser();
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [hoveredRating, setHoveredRating] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      submitReview({
        authorName: userProfile.name,
        authorRole: userProfile.role,
        authorAvatar: userProfile.avatarUrl,
        rating,
        comment: comment.trim()
      });
      setIsSubmitting(false);
      onClose();
      alert("Thank you! Your genuine review has been posted and will appear on our landing page.");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-noble-deep/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-noble-blue/10 rounded-xl">
              <Sparkles className="text-noble-blue w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Share Your Experience</h3>
              <p className="text-xs text-slate-400">Your feedback drives the Noble Clarity Engine.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* User Profile Summary */}
          <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <ImageSEO src={userProfile.avatarUrl} altText={`${userProfile.name} profile`} className="w-12 h-12 rounded-full border border-slate-600" />
            <div>
              <p className="text-sm font-bold text-white leading-none">{userProfile.name}</p>
              <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">{userProfile.role}</p>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rate the Platform</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoveredRating(s)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(s)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`w-8 h-8 ${(hoveredRating || rating) >= s ? 'text-amber-400 fill-current' : 'text-slate-700'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex justify-between">
              Your Genuine Review
              <span className="text-[10px] lowercase font-normal">{comment.length}/300</span>
            </label>
            <textarea
              required
              maxLength={300}
              rows={4}
              placeholder="How has Noble Clarity changed your business reporting?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-noble-blue focus:ring-1 focus:ring-noble-blue transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-2 text-emerald-400/60">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Authenticated Review Submission</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="w-full bg-noble-blue hover:bg-noble-blue/90 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-xl shadow-noble-blue/20 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Posting...' : <><Send className="w-4 h-4" /> Post Public Review</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
