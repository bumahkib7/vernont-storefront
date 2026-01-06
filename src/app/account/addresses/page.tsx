"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, MapPin, Loader2, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  country_code: "US",
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

  // Fetch addresses
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
      country_code: address.country_code || "US",
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wide mb-2">Your Addresses</h1>
          <p className="font-serif text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="btn-luxury bg-gold text-primary hover:bg-gold/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-serif flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Addresses List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-card border border-border relative"
            >

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm tracking-wide mb-1">
                    {address.first_name} {address.last_name}
                  </p>
                  {address.company && (
                    <p className="font-serif text-sm text-muted-foreground">
                      {address.company}
                    </p>
                  )}
                  <p className="font-serif text-sm text-muted-foreground">
                    {address.address_1}
                  </p>
                  {address.address_2 && (
                    <p className="font-serif text-sm text-muted-foreground">
                      {address.address_2}
                    </p>
                  )}
                  <p className="font-serif text-sm text-muted-foreground">
                    {address.city}, {address.province} {address.postal_code}
                  </p>
                  <p className="font-serif text-sm text-muted-foreground">
                    {address.country_code}
                  </p>
                  {address.phone && (
                    <p className="font-serif text-sm text-muted-foreground mt-2">
                      {address.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border hover:border-gold"
                  onClick={() => openEditModal(address)}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingId === address.id}
                >
                  {deletingId === address.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-display text-xl tracking-wide mb-2">No addresses yet</h3>
          <p className="font-serif text-muted-foreground mb-6">
            Add your first address to make checkout faster
          </p>
          <Button
            onClick={openAddModal}
            className="btn-luxury bg-gold text-primary hover:bg-gold/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Address
          </Button>
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
              className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-xl tracking-wide">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Error */}
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-serif flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display text-sm tracking-wider uppercase mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="h-12 font-serif bg-background border-border focus:border-gold"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block font-display text-sm tracking-wider uppercase mb-2">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="h-12 font-serif bg-background border-border focus:border-gold"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block font-display text-sm tracking-wider uppercase mb-2">
                    Company
                  </label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="h-12 font-serif bg-background border-border focus:border-gold"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Address Lines */}
                <div>
                  <label className="block font-display text-sm tracking-wider uppercase mb-2">
                    Address Line 1 *
                  </label>
                  <Input
                    type="text"
                    name="address_1"
                    value={formData.address_1}
                    onChange={handleChange}
                    placeholder="Street address"
                    className="h-12 font-serif bg-background border-border focus:border-gold"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block font-display text-sm tracking-wider uppercase mb-2">
                    Address Line 2
                  </label>
                  <Input
                    type="text"
                    name="address_2"
                    value={formData.address_2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc."
                    className="h-12 font-serif bg-background border-border focus:border-gold"
                    disabled={isSubmitting}
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display text-sm tracking-wider uppercase mb-2">
                      City *
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="h-12 font-serif bg-background border-border focus:border-gold"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block font-display text-sm tracking-wider uppercase mb-2">
                      State / Province
                    </label>
                    <Input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="h-12 font-serif bg-background border-border focus:border-gold"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display text-sm tracking-wider uppercase mb-2">
                      Postal Code *
                    </label>
                    <Input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="h-12 font-serif bg-background border-border focus:border-gold"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block font-display text-sm tracking-wider uppercase mb-2">
                      Country *
                    </label>
                    <select
                      name="country_code"
                      value={formData.country_code}
                      onChange={handleChange}
                      className="w-full h-12 font-serif bg-background border border-border px-3 focus:border-gold focus:outline-none"
                      disabled={isSubmitting}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="JP">Japan</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-display text-sm tracking-wider uppercase mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="h-12 font-serif bg-background border-border focus:border-gold"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-border hover:border-gold"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-luxury bg-gold text-primary hover:bg-gold/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingAddress ? (
                      "Update Address"
                    ) : (
                      "Add Address"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
