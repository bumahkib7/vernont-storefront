"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, MapPin, Loader2, X, Check, AlertCircle } from "lucide-react";
import { customerApi, type CustomerAddress } from "@/lib/api";

interface AddressFormData {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  province: string;
  postal_code: string;
  country_code: string;
  phone: string;
}

const emptyFormData: AddressFormData = {
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "GB",
  phone: "",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyFormData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      const response = await customerApi.listAddresses();
      setAddresses(response.addresses || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData(emptyFormData);
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (address: CustomerAddress) => {
    setEditingAddress(address);
    setFormData({
      first_name: address.first_name || "",
      last_name: address.last_name || "",
      company: address.company || "",
      address_1: address.address_1 || "",
      address_2: address.address_2 || "",
      city: address.city || "",
      province: address.province || "",
      postal_code: address.postal_code || "",
      country_code: address.country_code || "GB",
      phone: address.phone || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData(emptyFormData);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.address_1 || !formData.city || !formData.postal_code || !formData.country_code) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await customerApi.updateAddress(editingAddress.id, formData);
        setSuccess("Address updated successfully");
      } else {
        await customerApi.createAddress(formData);
        setSuccess("Address added successfully");
      }
      closeModal();
      await fetchAddresses();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setDeletingId(addressId);
    try {
      await customerApi.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      setSuccess("Address deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[var(--muted-foreground)]">
          Manage your shipping and billing addresses
        </p>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Addresses List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 bg-[var(--surface)] border border-[var(--border)] rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm mb-1">
                    {address.first_name} {address.last_name}
                  </p>
                  {address.company && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {address.company}
                    </p>
                  )}
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {address.address_1}
                  </p>
                  {address.address_2 && (
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {address.address_2}
                    </p>
                  )}
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {address.city}
                    {address.province && `, ${address.province}`}
                    {address.postal_code && ` ${address.postal_code}`}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {address.country_code?.toUpperCase()}
                  </p>
                  {address.phone && (
                    <p className="text-sm text-[var(--muted-foreground)] mt-2">
                      {address.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                <button
                  onClick={() => openEditModal(address)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingId === address.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-[var(--destructive)]/30 text-[var(--destructive)] rounded-lg hover:bg-[var(--destructive)]/10 transition-colors disabled:opacity-50"
                >
                  {deletingId === address.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] rounded-lg">
          <div className="w-16 h-16 rounded-full bg-[var(--background)] flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No addresses yet</h3>
          <p className="text-[var(--muted-foreground)] mb-6">
            Add your first address to make checkout faster
          </p>
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Add Your First Address
          </button>
        </div>
      )}

      {/* Address Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                <h2 className="font-semibold text-lg">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Error */}
                {error && (
                  <div className="p-3 bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 rounded-lg text-[var(--destructive)] text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Company <span className="text-[var(--muted-foreground)]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Address Lines */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    name="address_1"
                    value={formData.address_1}
                    onChange={handleChange}
                    placeholder="Street address"
                    className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Address Line 2 <span className="text-[var(--muted-foreground)]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="address_2"
                    value={formData.address_2}
                    onChange={handleChange}
                    placeholder="Flat, apartment, unit, etc."
                    className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                {/* City, State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      County / Region
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Postal, Country */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Country *
                    </label>
                    <select
                      name="country_code"
                      value={formData.country_code}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                      disabled={isSubmitting}
                    >
                      <option value="GB">United Kingdom</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="JP">Japan</option>
                      <option value="IE">Ireland</option>
                      <option value="NL">Netherlands</option>
                      <option value="BE">Belgium</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Phone <span className="text-[var(--muted-foreground)]">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+44 7123 456789"
                    className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all text-sm"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg hover:bg-[var(--background)] transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingAddress ? (
                      "Update Address"
                    ) : (
                      "Add Address"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
