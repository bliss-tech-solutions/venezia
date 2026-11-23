import { Reveal } from "../Reveal";
import { site, totals, unitTypes } from "@/data/project";

const stats = [
  { value: String(totals.towers), label: "Residential blocks", note: "A · B · C · D · E" },
  { value: String(totals.levels), label: "Residential levels", note: "Levels 1 to 14" },
  { value: String(totals.residences), label: "Residences", note: `${totals.perFloor} per floor` },
  { value: String(Object.keys(unitTypes).length), label: "Plan typologies", note: "All 2 BHK" },
];

export function Story() {
  return (
    <section id="story" className="section story">
      <div className="container">
        <Reveal className="story__head">
          <p className="eyebrow">The Address</p>
          <h2 className="display">
            A landmark <em>defined</em> by style &amp; sophistication.
          </h2>
        </Reveal>

        <div className="story__grid">
          <Reveal className="story__text" delay={100}>
            <p className="lead">{site.description}</p>
            <p>
              Slender towers rise from a landscaped podium, each framed in pale stone and layered with timber-toned
              balconies and planters. At street level, a continuous retail promenade gives the building a life of its own;
              above it, every residence is planned around light, cross-ventilation and a green edge.
            </p>
            <a href="#top" className="btn btn--link">
              Explore availability →
            </a>
          </Reveal>

          <dl className="stats">
            {stats.map((s, i) => (
              <Reveal key={s.label} className="stats__item" delay={150 + i * 90}>
                <dt>{s.label}</dt>
                <dd>
                  <span className="stats__value">{s.value}</span>
                  <span className="stats__note">{s.note}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
