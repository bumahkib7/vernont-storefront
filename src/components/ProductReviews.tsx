"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Check,
  ChevronDown,
  Filter,
  ImageIcon,
  User,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useProductReviews,
  useVoteReview,
  useReportReview,
} from "@/lib/hooks";
import type { Review, ReviewStats, RatingDistributionItem } from "@/lib/schemas";
import { useAuth } from "@/context/AuthContext";

interface ProductReviewsProps {
  productId: string;
}

const SORT_OPTIONS = [
  { value: "MOST_HELPFUL", label: "Most Helpful" },
  { value: "NEWEST", label: "Newest" },
  { value: "HIGHEST_RATED", label: "Highest Rated" },
  { value: "LOWEST_RATED", label: "Lowest Rated" },
];

const REPORT_REASONS = [
  { value: "SPAM", label: "Spam or fake" },
  { value: "OFFENSIVE", label: "Offensive content" },
  { value: "IRRELEVANT", label: "Not relevant" },
  { value: "OTHER", label: "Other" },
];

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { isAuthenticated } = useAuth();
  const [sortBy, setSortBy] = useState<string>("MOST_HELPFUL");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [withImagesOnly, setWithImagesOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useProductReviews(productId, {
    page,
    size: 10,
    sort: sortBy as 'NEWEST' | 'OLDEST' | 'HIGHEST_RATED' | 'LOWEST_RATED' | 'MOST_HELPFUL',
    rating: filterRating ?? undefined,
    verified_only: verifiedOnly || undefined,
    with_images: withImagesOnly || undefined,
    include_stats: true,
  });

  const reviews = data?.reviews || [];
  const stats = data?.stats;
  const totalPages = Math.ceil((data?.total || 0) / 10);

  const handleFilterChange = (rating: number | null) => {
    setFilterRating(rating);
    setPage(0);
  };

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      {stats && <ReviewSummary stats={stats} onFilterRating={handleFilterChange} selectedRating={filterRating} />}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(verifiedOnly || withImagesOnly || filterRating) && (
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            )}
          </button>
          {filterRating && (
            <button
              onClick={() => handleFilterChange(null)}
              className="px-2 py-1 text-xs bg-[var(--primary)] text-white rounded-full flex items-center gap-1"
            >
              {filterRating} stars
              <span className="text-white/80">&times;</span>
            </button>
          )}
          {verifiedOnly && (
            <button
              onClick={() => { setVerifiedOnly(false); setPage(0); }}
              className="px-2 py-1 text-xs bg-[var(--success)] text-white rounded-full flex items-center gap-1"
            >
              Verified
              <span className="text-white/80">&times;</span>
            </button>
          )}
          {withImagesOnly && (
            <button
              onClick={() => { setWithImagesOnly(false); setPage(0); }}
              className="px-2 py-1 text-xs bg-[var(--accent)] text-white rounded-full flex items-center gap-1"
            >
              With images
              <span className="text-white/80">&times;</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted-foreground)]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
            className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-4 p-4 bg-[var(--surface)] rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(0); }}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <Check className="w-4 h-4 text-[var(--success)]" />
                <span className="text-sm">Verified purchases only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withImagesOnly}
                  onChange={(e) => { setWithImagesOnly(e.target.checked); setPage(0); }}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm">With images only</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)]">
            {filterRating || verifiedOnly || withImagesOnly
              ? "No reviews match your filters."
              : "No reviews yet. Be the first to review this product!"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              productId={productId}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg disabled:opacity-50 hover:bg-[var(--surface)] transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-[var(--muted-foreground)]">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg disabled:opacity-50 hover:bg-[var(--surface)] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

interface ReviewSummaryProps {
  stats: ReviewStats;
  onFilterRating: (rating: number | null) => void;
  selectedRating: number | null;
}

function ReviewSummary({ stats, onFilterRating, selectedRating }: ReviewSummaryProps) {
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-8 p-6 bg-[var(--surface)] rounded-xl">
      {/* Average Rating */}
      <div className="text-center md:text-left">
        <div className="text-5xl font-bold mb-2">{stats.average_rating.toFixed(1)}</div>
        <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(stats.average_rating)
                  ? "text-[var(--warning)] fill-current"
                  : "text-[var(--border)]"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Based on {stats.total_reviews} {stats.total_reviews === 1 ? "review" : "reviews"}
        </p>
        {stats.recommendation_percent > 0 && (
          <p className="text-sm text-[var(--success)] mt-1">
            {stats.recommendation_percent}% recommend
          </p>
        )}
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const dist = stats.rating_distribution.find((d) => d.stars === stars);
          const count = dist?.count || 0;
          const percent = dist?.percent || 0;
          const isSelected = selectedRating === stars;

          return (
            <button
              key={stars}
              onClick={() => onFilterRating(isSelected ? null : stars)}
              className={`flex items-center gap-3 w-full group transition-colors ${
                isSelected ? "bg-[var(--primary)]/10" : "hover:bg-[var(--background)]"
              } rounded-lg p-1 -m-1`}
            >
              <span className="text-sm w-12 flex items-center gap-1">
                {stars} <Star className="w-3 h-3 text-[var(--warning)] fill-current" />
              </span>
              <div className="flex-1 h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--warning)] transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-sm text-[var(--muted-foreground)] w-16 text-right">
                {count} ({percent}%)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  productId: string;
  isAuthenticated: boolean;
}

function ReviewCard({ review, productId, isAuthenticated }: ReviewCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [expandedImages, setExpandedImages] = useState(false);
  const voteMutation = useVoteReview();
  const reportMutation = useReportReview();

  const handleVote = (helpful: boolean) => {
    if (!isAuthenticated) return;
    voteMutation.mutate({ reviewId: review.id, productId, helpful });
  };

  const handleReport = (reason: string, description?: string) => {
    reportMutation.mutate(
      { reviewId: review.id, reason, description },
      { onSuccess: () => setShowReportModal(false) }
    );
  };

  return (
    <div className="border-b border-[var(--border)] pb-6 last:border-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {review.customer_avatar ? (
            <Image
              src={review.customer_avatar}
              alt={review.customer_name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--muted-foreground)]" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.customer_name}</span>
              {review.verified_purchase && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-[var(--success)]/10 text-[var(--success)] rounded-full">
                  <Check className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < review.rating
                        ? "text-[var(--warning)] fill-current"
                        : "text-[var(--border)]"
                    }`}
                  />
                ))}
              </div>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </span>
              {review.is_edited && <span className="italic">(edited)</span>}
            </div>
          </div>
        </div>
        {review.variant_title && (
          <span className="text-xs text-[var(--muted-foreground)] bg-[var(--surface)] px-2 py-1 rounded">
            {review.variant_title}
          </span>
        )}
      </div>

      {/* Title & Content */}
      <h4 className="font-semibold mb-2">{review.title}</h4>
      <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">{review.content}</p>

      {/* Pros & Cons */}
      {(review.pros?.length || review.cons?.length) && (
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {review.pros && review.pros.length > 0 && (
            <div className="space-y-1">
              <span className="text-sm font-medium text-[var(--success)]">Pros</span>
              <ul className="space-y-1">
                {review.pros.map((pro, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-[var(--success)]">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons && review.cons.length > 0 && (
            <div className="space-y-1">
              <span className="text-sm font-medium text-[var(--destructive)]">Cons</span>
              <ul className="space-y-1">
                {review.cons.map((con, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-[var(--destructive)]">-</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className={`grid grid-cols-4 gap-2 ${expandedImages ? "" : "max-h-24 overflow-hidden"}`}>
            {review.images.map((image, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={image.thumbnail_url || image.url}
                  alt={image.caption || `Review image ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          {review.images.length > 4 && !expandedImages && (
            <button
              onClick={() => setExpandedImages(true)}
              className="text-sm text-[var(--primary)] mt-2"
            >
              Show all {review.images.length} images
            </button>
          )}
        </div>
      )}

      {/* Admin Response */}
      {review.admin_response && (
        <div className="p-4 bg-[var(--surface)] rounded-lg mb-4">
          <p className="text-sm font-medium mb-1">Response from Vernont</p>
          <p className="text-sm text-[var(--muted-foreground)]">{review.admin_response}</p>
          {review.admin_response_at && (
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              {formatDistanceToNow(new Date(review.admin_response_at), { addSuffix: true })}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-[var(--muted-foreground)]">Was this helpful?</span>
        <button
          onClick={() => handleVote(true)}
          disabled={!isAuthenticated || voteMutation.isPending}
          className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{review.helpful_count}</span>
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={!isAuthenticated || voteMutation.isPending}
          className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] disabled:opacity-50 transition-colors"
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{review.not_helpful_count}</span>
        </button>
        <button
          onClick={() => setShowReportModal(true)}
          disabled={!isAuthenticated}
          className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--destructive)] disabled:opacity-50 transition-colors ml-auto"
        >
          <Flag className="w-4 h-4" />
          Report
        </button>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <ReportModal
            onClose={() => setShowReportModal(false)}
            onSubmit={handleReport}
            isLoading={reportMutation.isPending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (reason: string, description?: string) => void;
  isLoading: boolean;
}

function ReportModal({ onClose, onSubmit, isLoading }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md bg-[var(--background)] rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Report Review</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">Select a reason</option>
              {REPORT_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Additional details (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              placeholder="Provide more context..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(reason, description || undefined)}
              disabled={!reason || isLoading}
              className="px-4 py-2 text-sm bg-[var(--destructive)] text-white rounded-lg disabled:opacity-50 hover:bg-[var(--destructive)]/90 transition-colors"
            >
              {isLoading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
