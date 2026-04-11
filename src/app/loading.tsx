// Root loading UI. Intentionally dependency-free (no Phosphor, no framer-motion)
// so the fallback payload shipped on slow routes stays tiny. Uses the Manrope
// font already loaded by the root layout via CSS inheritance.
export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-[#FAFAFA] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[480px] flex flex-col items-center justify-center text-center gap-8">
        <span
          className="text-2xl uppercase text-[#1A1A1A]"
          style={{
            fontFamily: '"Crimson Pro", Georgia, serif',
            letterSpacing: "0.2em",
          }}
        >
          Vernont
        </span>
        <div
          className="w-10 h-10 rounded-full border-2 border-[#E5E5E5] border-t-[#1A1A1A] animate-spin"
          aria-label="Loading"
          role="status"
        />
      </div>
    </div>
  );
}
