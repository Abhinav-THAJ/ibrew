"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import { useModalBehavior } from "./useModalBehavior";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const OTP_LENGTH = 4;
const EMPTY_OTP = Array(OTP_LENGTH).fill("") as string[];

// Indian mobile numbers: 10 digits, starting with 6, 7, 8 or 9
const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(EMPTY_OTP);
  const [error, setError] = useState("");

  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  const closeAndReset = () => {
    setStep("phone");
    setPhone("");
    setOtp(EMPTY_OTP);
    setError("");
    onClose();
  };

  useModalBehavior(isOpen, closeAndReset);

  if (!isOpen) return null;

  /* ---------- Step 1: phone number ---------- */

  const handlePhoneChange = (value: string) => {
    // keep digits only, max 10
    setPhone(value.replace(/\D/g, "").slice(0, 10));
    setError("");
  };

  const handleSendOtp = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValidPhone(phone)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    // TODO: call your "send OTP" API here
    setStep("otp");
  };

  /* ---------- Step 2: OTP ---------- */

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    setError("");

    // move to the next box after typing a digit
    if (digit && index < OTP_LENGTH - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // backspace on an empty box goes back to the previous one
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (event: React.FormEvent) => {
    event.preventDefault();

    if (otp.join("").length < OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code`);
      return;
    }

    // TODO: call your "verify OTP" API here, then close on success
    closeAndReset();
  };

  const goBackToPhone = () => {
    setStep("phone");
    setOtp(EMPTY_OTP);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <button
        type="button"
        aria-label="Close login"
        onClick={closeAndReset}
        className="absolute inset-0 h-full w-full cursor-default bg-black/60"
      />

      {/* Modal box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Login"
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-black shadow-2xl sm:p-8"
      >
        {/* Back button (OTP step) and close button */}
        {step === "otp" && (
          <button
            type="button"
            onClick={goBackToPhone}
            aria-label="Change phone number"
            className="absolute left-4 top-4 rounded-full p-1.5 transition hover:bg-neutral-100"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <button
          type="button"
          onClick={closeAndReset}
          aria-label="Close login"
          className="absolute right-4 top-4 rounded-full p-1.5 transition hover:bg-neutral-100"
        >
          <X size={20} />
        </button>

        {/* Logo image (replace the file at /public/images/logo.png) */}
        <div className="flex justify-center pt-4">
          <Image
            src="/images/logo.png"
            alt="Imaan's Store"
            width={160}
            height={64}
            unoptimized
            className="h-14 w-auto object-contain"
          />
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="mt-6">
            <h2 className="text-center text-lg font-semibold">
              Log in or Sign up
            </h2>

            <div className="mt-5 flex items-center rounded-lg border border-neutral-300 focus-within:border-black">
              <span className="border-r border-neutral-300 px-3 text-sm text-neutral-600">
                +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                autoFocus
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full rounded-r-lg bg-transparent px-3 py-3 text-sm outline-none"
              />
            </div>

            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-green-700 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Continue
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-neutral-500">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline">
                Terms of service
              </a>{" "}
              &amp;{" "}
              <a href="/privacy" className="underline">
                Privacy policy
              </a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6">
            <h2 className="text-center text-lg font-semibold">
              OTP Verification
            </h2>
            <p className="mt-1 text-center text-sm text-neutral-500">
              We have sent a code to +91 {phone}
            </p>

            <div className="mt-5 flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    otpInputs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  autoFocus={index === 0}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  aria-label={`Digit ${index + 1}`}
                  className="h-12 w-12 rounded-lg border border-neutral-300 text-center text-lg outline-none focus:border-black"
                />
              ))}
            </div>

            {error && (
              <p className="mt-3 text-center text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-green-700 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
            >
              Verify
            </button>

            <button
              type="button"
              // TODO: call your "resend OTP" API here
              className="mt-4 w-full text-center text-xs text-neutral-500 underline"
            >
              Resend code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}