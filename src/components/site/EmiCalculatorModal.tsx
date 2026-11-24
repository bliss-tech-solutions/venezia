"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useExplorer } from "../explorer/ExplorerContext";

interface EmiCalculatorModalProps {
  open: boolean;
  onClose: () => void;
}

interface MonthDetail {
  monthName: string;
  principalPaid: number;
  interestCharged: number;
  totalPayment: number;
  balance: number;
}

interface YearGroup {
  year: number;
  months: MonthDetail[];
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PRESETS = [
  { label: "₹75 L", value: 7500000 },
  { label: "₹1 Cr", value: 10000000 },
  { label: "₹1.5 Cr", value: 15000000 },
  { label: "₹2 Cr", value: 20000000 },
];

const formatINR = (val: number) => {
  if (isNaN(val) || !isFinite(val)) return "₹0";
  return "₹" + Math.round(val).toLocaleString("en-IN");
};

export function EmiCalculatorModal({ open, onClose }: EmiCalculatorModalProps) {
  const [mounted, setMounted] = useState(false);
  const { enquire } = useExplorer();

  // Primary state: Loan Amount, Interest Rate, Tenure (Years)
  const [loanAmount, setLoanAmount] = useState<number>(10000000); // 1 Crore default for Venezia luxury flats
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% p.a. typical home loan rate
  const [loanTenure, setLoanTenure] = useState<number>(20); // 20 years standard luxury home loan

  // Editable text inputs for direct user editing
  const [loanInput, setLoanInput] = useState<string>("10000000");
  const [rateInput, setRateInput] = useState<string>("8.5");
  const [tenureInput, setTenureInput] = useState<string>("20");

  // Amortization toggle and expanded year accordions
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({});

  // Client mount check for createPortal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize input fields when modal opens or defaults change
  useEffect(() => {
    if (open) {
      setLoanInput(loanAmount.toString());
      setRateInput(interestRate.toString());
      setTenureInput(loanTenure.toString());
    }
  }, [open, loanAmount, interestRate, loanTenure]);

  // Lock body scroll and pause Lenis while modal is open
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("is-locked");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("is-locked");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  // Handle Loan Amount changes
  const handleLoanSlider = (val: number) => {
    setLoanAmount(val);
    setLoanInput(val.toString());
  };

  const handleLoanInput = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    setLoanInput(clean);
    const num = Number(clean);
    if (!isNaN(num) && num > 0) {
      setLoanAmount(Math.min(50000000, num));
    }
  };

  const handleLoanBlur = () => {
    const num = Number(loanInput);
    if (isNaN(num) || num < 500000) {
      setLoanAmount(500000);
      setLoanInput("500000");
    } else if (num > 50000000) {
      setLoanAmount(50000000);
      setLoanInput("50000000");
    } else {
      setLoanAmount(num);
      setLoanInput(num.toString());
    }
  };

  // Handle Interest Rate changes
  const handleRateSlider = (val: number) => {
    setInterestRate(val);
    setRateInput(val.toString());
  };

  const handleRateInput = (val: string) => {
    const clean = val.replace(/[^0-9.]/g, "");
    setRateInput(clean);
    const num = parseFloat(clean);
    if (!isNaN(num) && num > 0) {
      setInterestRate(Math.min(25, num));
    }
  };

  const handleRateBlur = () => {
    const num = parseFloat(rateInput);
    if (isNaN(num) || num < 1) {
      setInterestRate(1);
      setRateInput("1");
    } else if (num > 25) {
      setInterestRate(25);
      setRateInput("25");
    } else {
      setInterestRate(num);
      setRateInput(num.toString());
    }
  };

  // Handle Tenure changes
  const handleTenureSlider = (val: number) => {
    setLoanTenure(val);
    setTenureInput(val.toString());
  };

  const handleTenureInput = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    setTenureInput(clean);
    const num = parseInt(clean, 10);
    if (!isNaN(num) && num > 0) {
      setLoanTenure(Math.min(30, num));
    }
  };

  const handleTenureBlur = () => {
    const num = parseInt(tenureInput, 10);
    if (isNaN(num) || num < 1) {
      setLoanTenure(1);
      setTenureInput("1");
    } else if (num > 30) {
      setLoanTenure(30);
      setTenureInput("30");
    } else {
      setLoanTenure(num);
      setTenureInput(num.toString());
    }
  };

  // Core EMI Calculations
  const { monthlyEmi, totalInterest, totalAmount, principalRatio, interestRatio } =
    useMemo(() => {
      const p = loanAmount;
      const r = interestRate / 12 / 100;
      const n = loanTenure * 12;

      if (p <= 0 || n <= 0) {
        return {
          monthlyEmi: 0,
          totalInterest: 0,
          totalAmount: 0,
          principalRatio: 1,
          interestRatio: 0,
        };
      }

      let emi = 0;
      if (r === 0) {
        emi = p / n;
      } else {
        const factor = Math.pow(1 + r, n);
        emi = (p * r * factor) / (factor - 1);
      }

      const totAmount = emi * n;
      const totInterest = Math.max(0, totAmount - p);
      const prRatio = totAmount > 0 ? p / totAmount : 1;
      const intRatio = totAmount > 0 ? totInterest / totAmount : 0;

      return {
        monthlyEmi: emi,
        totalInterest: totInterest,
        totalAmount: totAmount,
        principalRatio: prRatio,
        interestRatio: intRatio,
      };
    }, [loanAmount, interestRate, loanTenure]);

  // Generate Amortization Schedule (Yearly and Monthly)
  const amortizationSchedule = useMemo(() => {
    const schedule: YearGroup[] = [];
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;
    const emi = monthlyEmi;

    if (p <= 0 || n <= 0 || emi <= 0) return schedule;

    const startDate = new Date();
    let currentBalance = p;
    let curMonth = startDate.getMonth(); // 0-11
    let curYear = startDate.getFullYear();

    const yearBuckets: Record<number, MonthDetail[]> = {};

    for (let m = 1; m <= n; m++) {
      const interestForMonth = currentBalance * r;
      let principalForMonth = emi - interestForMonth;

      if (m === n || principalForMonth > currentBalance) {
        principalForMonth = currentBalance;
      }

      const totalPaymentForMonth = principalForMonth + interestForMonth;
      currentBalance = Math.max(0, currentBalance - principalForMonth);

      if (!yearBuckets[curYear]) {
        yearBuckets[curYear] = [];
      }

      yearBuckets[curYear].push({
        monthName: MONTH_NAMES[curMonth],
        principalPaid: principalForMonth,
        interestCharged: interestForMonth,
        totalPayment: totalPaymentForMonth,
        balance: currentBalance,
      });

      curMonth++;
      if (curMonth > 11) {
        curMonth = 0;
        curYear++;
      }
    }

    const years = Object.keys(yearBuckets)
      .map(Number)
      .sort((a, b) => a - b);

    for (const y of years) {
      schedule.push({
        year: y,
        months: yearBuckets[y],
      });
    }

    return schedule;
  }, [loanAmount, interestRate, loanTenure, monthlyEmi]);

  // Expand first two years initially
  useEffect(() => {
    if (amortizationSchedule.length > 0) {
      setExpandedYears((prev) => {
        const next = { ...prev };
        amortizationSchedule.forEach((yg, idx) => {
          if (next[yg.year] === undefined) {
            next[yg.year] = idx < 2;
          }
        });
        return next;
      });
    }
  }, [amortizationSchedule]);

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  // Donut chart SVG geometry
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const interestStroke = interestRatio * circumference;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="emi-backdrop"
          data-lenis-prevent="true"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="emi-title"
        >
          <motion.div
            className="emi-modal"
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Modal Header */}
            <div className="emi-modal__header">
              <div>
                <p className="eyebrow emi-modal__eyebrow">The Venezia · Financial Planning</p>
                <h2 id="emi-title" className="display emi-modal__title">
                  EMI <em>Calculator</em>
                </h2>
              </div>
              <button
                type="button"
                className="emi-close-btn"
                onClick={onClose}
                aria-label="Close EMI Calculator"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Calculator Body */}
            <div className="emi-modal__body">
              {/* Venezia Quick Loan Presets */}
              <div className="emi-presets">
                <span className="emi-presets__label">Quick Presets:</span>
                <div className="emi-presets__pills">
                  {PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`emi-preset-btn ${loanAmount === p.value ? "is-active" : ""}`}
                      onClick={() => handleLoanSlider(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="emi-grid">
                {/* Left Column: Sliders + Editable Badges */}
                <div className="emi-left">
                  {/* Field 1: Loan Amount */}
                  <div className="emi-control">
                    <div className="emi-control__head">
                      <span className="emi-label">Loan Amount</span>
                      <div className="emi-badge">
                        <span className="emi-badge__symbol">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={loanInput}
                          onChange={(e) => handleLoanInput(e.target.value)}
                          onBlur={handleLoanBlur}
                          className="emi-badge__input"
                          aria-label="Loan amount in Rupees"
                        />
                      </div>
                    </div>
                    <div className="emi-slider-wrap">
                      <input
                        type="range"
                        min={500000}
                        max={30000000}
                        step={50000}
                        value={loanAmount}
                        onChange={(e) => handleLoanSlider(Number(e.target.value))}
                        className="emi-slider"
                        style={{
                          background: `linear-gradient(to right, #6aa5e4 0%, #8fd3ee ${
                            ((loanAmount - 500000) / (30000000 - 500000)) * 100
                          }%, rgba(255, 255, 255, 0.12) ${
                            ((loanAmount - 500000) / (30000000 - 500000)) * 100
                          }%, rgba(255, 255, 255, 0.12) 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Field 2: Rate of Interest */}
                  <div className="emi-control">
                    <div className="emi-control__head">
                      <span className="emi-label">Rate of Interest (p.a)</span>
                      <div className="emi-badge">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={rateInput}
                          onChange={(e) => handleRateInput(e.target.value)}
                          onBlur={handleRateBlur}
                          className="emi-badge__input emi-badge__input--rate"
                          aria-label="Rate of interest in percent"
                        />
                        <span className="emi-badge__symbol">%</span>
                      </div>
                    </div>
                    <div className="emi-slider-wrap">
                      <input
                        type="range"
                        min={6}
                        max={16}
                        step={0.1}
                        value={interestRate}
                        onChange={(e) => handleRateSlider(Number(e.target.value))}
                        className="emi-slider"
                        style={{
                          background: `linear-gradient(to right, #6aa5e4 0%, #8fd3ee ${
                            ((interestRate - 6) / (16 - 6)) * 100
                          }%, rgba(255, 255, 255, 0.12) ${
                            ((interestRate - 6) / (16 - 6)) * 100
                          }%, rgba(255, 255, 255, 0.12) 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Field 3: Loan Tenure */}
                  <div className="emi-control">
                    <div className="emi-control__head">
                      <span className="emi-label">Loan Tenure</span>
                      <div className="emi-badge">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={tenureInput}
                          onChange={(e) => handleTenureInput(e.target.value)}
                          onBlur={handleTenureBlur}
                          className="emi-badge__input emi-badge__input--tenure"
                          aria-label="Loan tenure in years"
                        />
                        <span className="emi-badge__symbol">Yr</span>
                      </div>
                    </div>
                    <div className="emi-slider-wrap">
                      <input
                        type="range"
                        min={1}
                        max={30}
                        step={1}
                        value={loanTenure}
                        onChange={(e) => handleTenureSlider(Number(e.target.value))}
                        className="emi-slider"
                        style={{
                          background: `linear-gradient(to right, #6aa5e4 0%, #8fd3ee ${
                            ((loanTenure - 1) / (30 - 1)) * 100
                          }%, rgba(255, 255, 255, 0.12) ${
                            ((loanTenure - 1) / (30 - 1)) * 100
                          }%, rgba(255, 255, 255, 0.12) 100%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Summary Rows */}
                  <div className="emi-summary">
                    <div className="emi-summary__card">
                      <div className="emi-summary__row emi-summary__row--highlight">
                        <span className="emi-summary__label">Monthly EMI</span>
                        <span className="emi-summary__value emi-summary__value--highlight">
                          {formatINR(monthlyEmi)}
                        </span>
                      </div>
                      <div className="emi-summary__row">
                        <span className="emi-summary__label">Principal Amount</span>
                        <span className="emi-summary__value">{formatINR(loanAmount)}</span>
                      </div>
                      <div className="emi-summary__row">
                        <span className="emi-summary__label">Total Interest</span>
                        <span className="emi-summary__value">{formatINR(totalInterest)}</span>
                      </div>
                      <div className="emi-summary__row">
                        <span className="emi-summary__label">Total Payment (Principal + Interest)</span>
                        <span className="emi-summary__value">{formatINR(totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Legend + Donut Chart + Financing CTA */}
                <div className="emi-right">
                  <div className="emi-legend">
                    <div className="emi-legend__item">
                      <span className="emi-legend__dot emi-legend__dot--principal" />
                      <span>Principal Amount</span>
                    </div>
                    <div className="emi-legend__item">
                      <span className="emi-legend__dot emi-legend__dot--interest" />
                      <span>Interest Amount</span>
                    </div>
                  </div>

                  <div className="emi-chart-box">
                    <svg
                      viewBox="0 0 200 200"
                      className="emi-chart-svg"
                      aria-label={`Donut chart showing ${Math.round(principalRatio * 100)}% principal and ${Math.round(interestRatio * 100)}% interest`}
                    >
                      {/* Base Track (Principal Amount: Deep Wave Blue) */}
                      <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#25427b"
                        strokeWidth="24"
                      />
                      {/* Interest Portion Arc (Luminous Sky Blue) */}
                      <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#8fd3ee"
                        strokeWidth="24"
                        strokeDasharray={`${interestStroke} ${circumference}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                        strokeLinecap="butt"
                        style={{ transition: "stroke-dasharray 0.4s ease" }}
                      />
                    </svg>

                    <div className="emi-chart-center">
                      <span className="emi-chart-center__val">
                        {Math.round(interestRatio * 100)}%
                      </span>
                      <span className="emi-chart-center__sub">Interest Ratio</span>
                    </div>
                  </div>

                  <div className="emi-cta-box">
                    <p className="emi-cta-box__text">
                      Tailored multi-bank financing options available for The Venezia.
                    </p>
                    <button
                      type="button"
                      className="btn btn--gold btn--sm emi-cta-box__btn"
                      onClick={() => {
                        onClose();
                        enquire();
                      }}
                    >
                      <span className="btn__label" data-text="Discuss Financing">
                        Discuss Financing
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Amortization Toggle */}
              <div className="emi-amort-toggle">
                <p className="emi-amort-toggle__text">
                  Your Amortization Details (Yearly/Monthly)
                </p>
                <button
                  type="button"
                  className="emi-amort-btn"
                  onClick={() => setShowAmortization((v) => !v)}
                  aria-expanded={showAmortization}
                  aria-label={showAmortization ? "Hide amortization table" : "Show amortization table"}
                >
                  {showAmortization ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Amortization Table Section */}
              <AnimatePresence>
                {showAmortization && (
                  <motion.div
                    className="emi-amort-section"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="emi-amort-years">
                      {amortizationSchedule.map((yg) => {
                        const isOpen = expandedYears[yg.year] ?? false;
                        return (
                          <div key={yg.year} className="emi-year-card">
                            <button
                              type="button"
                              className="emi-year-header"
                              onClick={() => toggleYear(yg.year)}
                              aria-expanded={isOpen}
                            >
                              <span className="emi-year-title">{yg.year}</span>
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`emi-year-chevron ${isOpen ? "is-open" : ""}`}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>

                            {isOpen && (
                              <div className="emi-table-wrap">
                                <table className="emi-table">
                                  <thead>
                                    <tr>
                                      <th>Month</th>
                                      <th>Principal Paid</th>
                                      <th>Interest Charged</th>
                                      <th>Total Payment</th>
                                      <th>Balance</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {yg.months.map((m, idx) => (
                                      <tr key={idx}>
                                        <td className="emi-td--month">{m.monthName}</td>
                                        <td>{formatINR(m.principalPaid)}</td>
                                        <td>{formatINR(m.interestCharged)}</td>
                                        <td>{formatINR(m.totalPayment)}</td>
                                        <td>{formatINR(m.balance)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
