"use client";

import { useEffect, useState } from "react";
import { Reveal } from "../Reveal";
import { useExplorer } from "../explorer/ExplorerContext";
import { site, unitById, unitTypes } from "@/data/project";

type State = "idle" | "sending" | "sent" | "error";

export function Enquire() {
  const { enquiryUnit } = useExplorer();
  const [state, setState] = useState<State>("idle");
  const [interest, setInterest] = useState("");

  useEffect(() => {
    if (!enquiryUnit) return;
    const u = unitById(enquiryUnit);
    if (u) setInterest(`Residence ${u.number} · Block ${u.block} · ${unitTypes[u.type].label}`);
  }, [enquiryUnit]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setState("sending");
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <section id="enquire" className="section enquire">
      <div className="container enquire__grid">
        <Reveal className="enquire__intro">
          <p className="eyebrow eyebrow--line">Private visit</p>
          <h2 className="display">
            See it <em>in person.</em>
          </h2>
          <p className="section__intro">
            Our sales team will walk you through the sample residence, current availability and payment plans — at a time
            that suits you.
          </p>
          <ul className="contact">
            <li>
              <span>Call</span>
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a>
            </li>
            <li>
              <span>Visit</span>
              <p>{site.contact.address}</p>
            </li>
          </ul>
        </Reveal>

        <Reveal className="enquire__form-wrap" delay={120}>
          {state === "sent" ? (
            <div className="form-done">
              <p className="eyebrow">Thank you</p>
              <p className="form-done__title">We&rsquo;ll be in touch within one working day.</p>
              <button className="btn btn--ghost btn--sm" onClick={() => setState("idle")}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <div className="field">
                <input id="f-name" name="name" required placeholder=" " autoComplete="name" />
                <label htmlFor="f-name">Full name</label>
              </div>
              <div className="form__row">
                <div className="field">
                  <input id="f-phone" name="phone" required placeholder=" " type="tel" autoComplete="tel" />
                  <label htmlFor="f-phone">Phone</label>
                </div>
                <div className="field">
                  <input id="f-email" name="email" placeholder=" " type="email" autoComplete="email" />
                  <label htmlFor="f-email">Email</label>
                </div>
              </div>
              <div className="field">
                <input
                  id="f-interest"
                  name="interest"
                  placeholder=" "
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                />
                <label htmlFor="f-interest">Residence of interest</label>
              </div>
              <div className="field">
                <select id="f-when" name="when" defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  <option>This week</option>
                  <option>Next week</option>
                  <option>Within a month</option>
                  <option>Just exploring</option>
                </select>
                <label htmlFor="f-when" className="is-up">
                  Preferred visit
                </label>
              </div>
              <div className="field">
                <textarea id="f-msg" name="message" placeholder=" " rows={3} />
                <label htmlFor="f-msg">Message (optional)</label>
              </div>
              <button className="btn btn--gold btn--block" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Request a private visit"}
              </button>
              {state === "error" && <p className="form__error">Something went wrong. Please call us instead.</p>}
              <p className="fineprint">By submitting you agree to be contacted about The Venezia.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
