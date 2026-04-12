"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FloppyDisk, SpinnerGap, Check, WarningCircle, Trash, Lock, User, DownloadSimple, ShieldCheck } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { customerApi } from "@/lib/api";
import { useDeleteAccount } from "@/lib/hooks";

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const handleDownloadData = async () => {
    setDownloading(true);
    setDownloadError("");
    try {
      // Use the same-origin proxy (/api/proxy) so auth cookies are forwarded
      // correctly. Direct backend calls fail cross-origin on production.
      const res = await fetch("/api/proxy/store/customers/me/data-export", {
        credentials: "include",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      if (!res.ok) throw new Error("Failed to export data");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vernont-data-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("Unable to download your data right now. Please try again later or contact privacy@vernont.com.");
    } finally {
      setDownloading(false);
    }
  };

  const deleteAccountMutation = useDeleteAccount({
    onSuccess: async () => {
      await logout();
      router.push("/");
    },
    onError: (err) => {
      setError(err.message || "Failed to delete account");
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setIsSaved(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await customerApi.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      });
      await refreshUser();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-[var(--border)]">
          <div className="h-10 w-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
            <User className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="font-semibold">Personal Information</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Update your profile details</p>
          </div>
        </div>

        <div className="p-5">
          {/* Success Message */}
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Profile updated successfully
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-lg text-[var(--destructive)] text-sm flex items-center gap-2"
            >
              <WarningCircle className="h-4 w-4" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                  disabled={isLoading}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full px-3 py-2.5 bg-[var(--background)]/50 border border-[var(--border)] rounded-lg text-[var(--muted-foreground)] cursor-not-allowed text-sm"
                disabled
              />
              <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Phone Number <span className="text-[var(--muted-foreground)]">(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+44 7123 456789"
                className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? (
                  <SpinnerGap className="h-4 w-4 animate-spin" />
                ) : (
                  <FloppyDisk className="h-4 w-4" />
                )}
                FloppyDisk Changes
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-[var(--border)]">
          <div className="h-10 w-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="font-semibold">Password</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Manage your password</p>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            To change your password, use the password reset flow. We&apos;ll send you an email with instructions.
          </p>
          <button
            onClick={() => window.location.href = "/forgot-password"}
            className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-sm font-medium"
          >
            Change Password
          </button>
        </div>
      </motion.div>

      {/* Your Data */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-[var(--border)]">
          <div className="h-10 w-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="font-semibold">Your Data</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Data portability &amp; privacy rights</p>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Download a copy of all personal data we hold about you (GDPR Article 20).
            The export includes your profile, orders, addresses, and preferences as a JSON file.
          </p>

          {downloadError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-lg text-[var(--destructive)] text-sm flex items-center gap-2"
            >
              <WarningCircle className="h-4 w-4" />
              {downloadError}
            </motion.div>
          )}

          <button
            onClick={handleDownloadData}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-sm font-medium disabled:opacity-50"
          >
            {downloading ? (
              <SpinnerGap className="h-4 w-4 animate-spin" />
            ) : (
              <DownloadSimple className="h-4 w-4" />
            )}
            Download My Data
          </button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[var(--surface)] border border-[var(--destructive)]/20 rounded-lg overflow-hidden"
      >
        <div className="flex items-center gap-3 p-5 border-b border-[var(--destructive)]/20">
          <div className="h-10 w-10 rounded-lg bg-[var(--destructive)]/10 flex items-center justify-center">
            <Trash className="h-5 w-5 text-[var(--destructive)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--destructive)]">Danger Zone</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Irreversible actions</p>
          </div>
        </div>

        <div className="p-5">
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Once you delete your account, there is no going back. This will permanently remove all your data including order history, wishlist, and addresses.
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteAccountMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--destructive)]/30 text-[var(--destructive)] rounded-lg hover:bg-[var(--destructive)]/10 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {deleteAccountMutation.isPending ? (
              <SpinnerGap className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
            Delete Account
          </button>
        </div>
      </motion.div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--surface)] border border-[var(--border)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers, including your order history,
              wishlist, and addresses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[var(--border)]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAccountMutation.mutate()}
              className="bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90"
            >
              {deleteAccountMutation.isPending ? (
                <SpinnerGap className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
