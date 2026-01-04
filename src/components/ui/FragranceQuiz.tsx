"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: "occasion",
    question: "When will you wear this fragrance?",
    options: [
      { value: "everyday", label: "Everyday Elegance", icon: "☀️", description: "Office, meetings, daily life" },
      { value: "evening", label: "Evening Affairs", icon: "🌙", description: "Dinners, dates, special events" },
      { value: "special", label: "Special Occasions", icon: "✨", description: "Celebrations, memorable moments" },
      { value: "all", label: "Any Occasion", icon: "💫", description: "Versatile, day to night" },
    ],
  },
  {
    id: "intensity",
    question: "What intensity do you prefer?",
    options: [
      { value: "light", label: "Whisper", icon: "🌸", description: "Soft, intimate, close to skin" },
      { value: "moderate", label: "Presence", icon: "🌺", description: "Noticeable but not overpowering" },
      { value: "strong", label: "Statement", icon: "🔥", description: "Bold, memorable, leaves a trail" },
    ],
  },
  {
    id: "notes",
    question: "Which scent family calls to you?",
    options: [
      { value: "floral", label: "Floral", icon: "🌹", description: "Rose, jasmine, peony" },
      { value: "woody", label: "Woody", icon: "🌲", description: "Sandalwood, cedar, oud" },
      { value: "fresh", label: "Fresh", icon: "🍋", description: "Citrus, marine, green" },
      { value: "oriental", label: "Oriental", icon: "🌟", description: "Vanilla, amber, spices" },
    ],
  },
  {
    id: "mood",
    question: "What mood do you want to evoke?",
    options: [
      { value: "confident", label: "Confident & Bold", icon: "👑", description: "Powerful, commanding presence" },
      { value: "romantic", label: "Romantic & Sensual", icon: "❤️", description: "Alluring, intimate, seductive" },
      { value: "fresh", label: "Fresh & Energetic", icon: "⚡", description: "Vibrant, youthful, dynamic" },
      { value: "sophisticated", label: "Sophisticated & Refined", icon: "💎", description: "Elegant, timeless, classic" },
    ],
  },
];

const recommendations: Record<string, { name: string; id: string; description: string; image: string }> = {
  "floral-romantic": {
    name: "Midnight Rose",
    id: "midnight-rose",
    description: "A romantic symphony of Bulgarian rose and soft musk",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
  },
  "woody-confident": {
    name: "Velvet Oud",
    id: "velvet-oud",
    description: "Luxurious oud with warm amber and smoky incense",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80",
  },
  "oriental-sophisticated": {
    name: "Golden Saffron",
    id: "golden-saffron",
    description: "Precious saffron with golden amber and exotic spices",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80",
  },
  "fresh-energetic": {
    name: "Ocean Breeze",
    id: "ocean-breeze",
    description: "Crisp marine notes with bergamot and white musk",
    image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80",
  },
  default: {
    name: "Signature Collection",
    id: "signature",
    description: "Explore our most beloved fragrances",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&q=80",
  },
};

interface FragranceQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FragranceQuiz({ isOpen, onClose }: FragranceQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const getRecommendation = () => {
    const key = `${answers.notes}-${answers.mood}`;
    return recommendations[key] || recommendations.default;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-border">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-gold" />
              <h2 className="font-display text-xl tracking-wide">Find Your Signature Scent</h2>
            </div>
            {!showResult && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-serif text-muted-foreground">
                  <span>Question {step + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-display text-2xl tracking-wide mb-6 text-center">
                    {currentQuestion.question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option.value)}
                        className={`p-5 border text-left transition-all ${
                          answers[currentQuestion.id] === option.value
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/50"
                        }`}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <p className="font-display tracking-wide mb-1">{option.label}</p>
                        <p className="font-serif text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>

                  {step > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 mt-6 font-serif text-sm text-muted-foreground hover:text-gold transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous question
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 mx-auto mb-6 bg-gold rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="h-7 w-7 text-primary" />
                  </motion.div>

                  <h3 className="font-display text-2xl tracking-wide mb-2">
                    Your Perfect Match
                  </h3>
                  <p className="font-serif text-muted-foreground mb-8">
                    Based on your preferences, we recommend:
                  </p>

                  <div className="bg-secondary p-6 mb-8">
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <Image
                        src={getRecommendation().image}
                        alt={getRecommendation().name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-display text-2xl tracking-wide mb-2">
                      {getRecommendation().name}
                    </h4>
                    <p className="font-serif text-muted-foreground">
                      {getRecommendation().description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href={`/product/${getRecommendation().id}`} onClick={onClose}>
                      <Button className="btn-luxury bg-gold text-primary hover:bg-gold/90 w-full sm:w-auto">
                        Discover This Fragrance
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="border-border hover:border-gold"
                    >
                      Retake Quiz
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
