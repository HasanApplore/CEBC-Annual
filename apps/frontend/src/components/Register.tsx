import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CreditCard, Loader2, MapPin } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useSiteData } from "../context/SiteDataContext";
import { apiPost } from "../lib/api";
import { ArrowButton } from "./ArrowButton";
import { Eyebrow } from "./Eyebrow";
import { ScrollReveal } from "./ScrollReveal";

type Step = "details" | "payment" | "confirmation";

interface FormState {
  name: string;
  email: string;
  title: string;
  company: string;
  country: string;
  phone: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  title: "",
  company: "",
  country: "",
  phone: "",
};

const steps: { key: Step; label: string }[] = [
  { key: "details", label: "Your Details" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmation" },
];

function StepIndicator({ current }: { current: Step }) {
  const currentIndex = steps.findIndex((s) => s.key === current);
  return (
    <div className="mx-auto mb-10 flex max-w-sm items-center justify-between">
      {steps.map((step, i) => (
        <div key={step.key} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                backgroundColor: i <= currentIndex ? "#5B8C5A" : "rgba(255,255,255,0.15)",
                scale: i === currentIndex ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            >
              {i < currentIndex ? <CheckCircle2 size={16} /> : i + 1}
            </motion.div>
            <span className="text-[11px] font-medium text-white/70">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="mx-2 mt-[-18px] h-0.5 flex-1 bg-white/15">
              <motion.div
                className="h-full bg-brand-green"
                initial={{ width: "0%" }}
                animate={{ width: i < currentIndex ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface FieldProps {
  label: string;
  name: keyof FormState;
  required?: boolean;
  type?: string;
  value: string;
  error?: string;
  onChange: (name: keyof FormState, value: string) => void;
}

function Field({ label, name, required, type = "text", value, error, onChange }: FieldProps) {
  return (
    <label className="block text-left">
      <span className="text-sm font-medium text-white/90">
        {label}
        {required && <span className="text-brand-green-light"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        aria-invalid={Boolean(error)}
        aria-required={required}
        className={`mt-1.5 w-full rounded-lg border bg-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none backdrop-blur-sm transition-colors focus:border-brand-green-light ${
          error ? "border-red-400" : "border-white/20"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

export function Register() {
  const { eventInfo } = useSiteData();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateField = (name: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validateDetails = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleDetailsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateDetails()) return;

    setSubmitError("");
    setSubmitting(true);
    try {
      await apiPost("/registrations", form);
      setStep("payment");
    } catch {
      setSubmitError("We couldn't save your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentContinue = () => {
    setSubmitting(true);
    // Payment gateway is not yet decided (provider/pricing/currency pending).
    // This simulated delay stands in for the real payment confirmation call.
    window.setTimeout(() => {
      setSubmitting(false);
      setStep("confirmation");
    }, 900);
  };

  const resetFlow = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitError("");
    setStep("details");
    setShowForm(false);
  };

  return (
    <section id="register" className="relative py-24">
      <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
        <ScrollReveal>
          <Eyebrow tone="light">Registration</Eyebrow>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Register Now
          </h2>
          <p className="mt-3 text-white/75">
            Secure your place at the 14th CEBC Annual Summit
          </p>
          <p className="mono-label mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-brand-green-light">
            <MapPin size={14} />
            {eventInfo.dateLabel} · {eventInfo.venue}
          </p>
        </ScrollReveal>

        {!showForm && (
          <ScrollReveal delay={0.1}>
            <div className="mt-10 flex justify-center">
              <ArrowButton variant="solid" onClick={() => setShowForm(true)}>
                Book Your Place
              </ArrowButton>
            </div>
          </ScrollReveal>
        )}

        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key="form-wrap"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel mt-10 rounded-card p-6 text-left sm:p-10"
            >
              <StepIndicator current={step} />

              <AnimatePresence mode="wait">
                {step === "details" && (
                  <motion.form
                    key="details"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleDetailsSubmit}
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                    noValidate
                  >
                    <Field label="Full Name" name="name" required value={form.name} error={errors.name} onChange={updateField} />
                    <Field label="Email" name="email" required type="email" value={form.email} error={errors.email} onChange={updateField} />
                    <Field label="Job Title" name="title" value={form.title} onChange={updateField} />
                    <Field label="Company" name="company" value={form.company} onChange={updateField} />
                    <Field label="Country" name="country" value={form.country} onChange={updateField} />
                    <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={updateField} />

                    {submitError && (
                      <p className="col-span-full text-sm text-red-300">{submitError}</p>
                    )}

                    <div className="col-span-full mt-2 flex justify-end">
                      <ArrowButton type="submit" variant="solid" disabled={submitting}>
                        {submitting ? "Submitting…" : "Continue to Payment"}
                      </ArrowButton>
                    </div>
                  </motion.form>
                )}

                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-white/25 bg-white/5 px-6 py-12 text-center">
                      <CreditCard size={34} className="text-brand-green-light" />
                      <p className="text-base font-semibold text-white">
                        Payment step placeholder
                      </p>
                      <p className="max-w-sm text-sm text-white/65">
                        The payment gateway, ticket pricing and currency for the 14th CEBC
                        Annual Summit have not been finalised yet. This step will be replaced
                        with live payment collection once confirmed.
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="mono-label text-xs font-medium text-white/70 transition-colors hover:text-white"
                      >
                        ← Back
                      </button>
                      <ArrowButton
                        type="button"
                        variant="solid"
                        disabled={submitting}
                        onClick={handlePaymentContinue}
                        className="disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {submitting && <Loader2 size={16} className="animate-spin" />}
                        {submitting ? "Confirming…" : "Complete Registration"}
                      </ArrowButton>
                    </div>
                  </motion.div>
                )}

                {step === "confirmation" && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center gap-4 py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
                    >
                      <CheckCircle2 size={52} className="text-brand-green-light" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">You're registered!</h3>
                    <p className="max-w-sm text-sm text-white/70">
                      Thank you, {form.name || "guest"}. A confirmation has been sent to{" "}
                      {form.email || "your email"}. We look forward to seeing you at the
                      14th CEBC Annual Summit on {eventInfo.dateLabel}.
                    </p>
                    <button
                      type="button"
                      onClick={resetFlow}
                      className="mt-2 text-sm font-medium text-brand-green-light transition-colors hover:text-white"
                    >
                      Register another attendee
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
