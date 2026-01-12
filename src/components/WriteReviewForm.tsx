"use client";

import { useState } from "react";
import { Star, Plus, X, Loader2, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateReview } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface WriteReviewFormProps {
  productId: string;
  productName: string;
  variantId?: string;
  variantTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function WriteReviewForm({
  productId,
  productName,
  variantId,
  variantTitle,
  onSuccess,
  onCancel,
}: WriteReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const createReview = useCreateReview();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleAddPro = () => {
    if (newPro.trim() && pros.length < 5) {
      setPros([...pros, newPro.trim()]);
      setNewPro("");
    }
  };

  const handleAddCon = () => {
    if (newCon.trim() && cons.length < 5) {
      setCons([...cons, newCon.trim()]);
      setNewCon("");
    }
  };

  const handleRemovePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const handleRemoveCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!rating) {
      setError("Please select a rating");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!content.trim() || content.trim().length < 20) {
      setError("Please write at least 20 characters in your review");
      return;
    }

    try {
      await createReview.mutateAsync({
        productId,
        data: {
          rating,
          title: title.trim(),
          content: content.trim(),
          pros: pros.length > 0 ? pros : undefined,
          cons: cons.length > 0 ? cons : undefined,
          variant_id: variantId,
        },
      });
      setSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-[var(--surface)] rounded-xl text-center">
        <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
        <p className="text-[var(--muted-foreground)] mb-4">
          You need to be logged in to write a review.
        </p>
        <Link href="/login" className="btn-primary">
          Log In to Review
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 bg-[var(--success)]/10 rounded-xl text-center"
      >
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--success)] flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Thank You!</h3>
        <p className="text-[var(--muted-foreground)]">
          Your review has been submitted and is pending approval.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Write a Review</h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          Share your experience with {productName}
          {variantTitle && <span className="font-medium"> ({variantTitle})</span>}
        </p>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-[var(--destructive)]/10 text-[var(--destructive)] rounded-lg text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Overall Rating <span className="text-[var(--destructive)]">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-[var(--warning)] fill-current"
                    : "text-[var(--border)]"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-3 text-sm text-[var(--muted-foreground)]">
              {rating === 5 && "Excellent"}
              {rating === 4 && "Good"}
              {rating === 3 && "Average"}
              {rating === 2 && "Below Average"}
              {rating === 1 && "Poor"}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Review Title <span className="text-[var(--destructive)]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          {title.length}/100 characters
        </p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Review <span className="text-[var(--destructive)]">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you like or dislike? How did you use this product?"
          rows={5}
          maxLength={5000}
          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
        />
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          {content.length}/5000 characters (minimum 20)
        </p>
      </div>

      {/* Pros */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Pros <span className="text-[var(--muted-foreground)]">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {pros.map((pro, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--success)]/10 text-[var(--success)] rounded-full text-sm"
            >
              <Plus className="w-3 h-3" />
              {pro}
              <button
                type="button"
                onClick={() => handleRemovePro(index)}
                className="ml-1 hover:text-[var(--success)]/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        {pros.length < 5 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newPro}
              onChange={(e) => setNewPro(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPro())}
              placeholder="Add a pro"
              maxLength={100}
              className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
            />
            <button
              type="button"
              onClick={handleAddPro}
              disabled={!newPro.trim()}
              className="px-3 py-2 text-sm bg-[var(--success)] text-white rounded-lg disabled:opacity-50 hover:bg-[var(--success)]/90 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Cons */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Cons <span className="text-[var(--muted-foreground)]">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {cons.map((con, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--destructive)]/10 text-[var(--destructive)] rounded-full text-sm"
            >
              <X className="w-3 h-3" />
              {con}
              <button
                type="button"
                onClick={() => handleRemoveCon(index)}
                className="ml-1 hover:text-[var(--destructive)]/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        {cons.length < 5 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newCon}
              onChange={(e) => setNewCon(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCon())}
              placeholder="Add a con"
              maxLength={100}
              className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
            />
            <button
              type="button"
              onClick={handleAddCon}
              disabled={!newCon.trim()}
              className="px-3 py-2 text-sm bg-[var(--destructive)] text-white rounded-lg disabled:opacity-50 hover:bg-[var(--destructive)]/90 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={createReview.isPending}
          className="flex-1 py-3 bg-[var(--primary)] text-white rounded-lg font-medium disabled:opacity-50 hover:bg-[var(--primary)]/90 transition-colors flex items-center justify-center gap-2"
        >
          {createReview.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>

      <p className="text-xs text-[var(--muted-foreground)] text-center">
        By submitting, you agree to our review guidelines. Reviews are subject to moderation.
      </p>
    </form>
  );
}
