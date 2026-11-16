import Image from "next/image";
import { Reveal } from "../Reveal";

export function Retail() {
  return (
    <section id="retail" className="section retail">
      <div className="container">
        <Reveal className="section__head section__head--split">
          <div>
            <p className="eyebrow eyebrow--line">The Promenade</p>
            <h2 className="display">
              A retail address <em>at your door.</em>
            </h2>
          </div>
          <p className="section__intro">
            Fifteen glazed shopfronts line S.G. Highway beneath the towers: tree-shaded frontage, visitor parking and a
            single canopy that ties the street together. Ideal for flagship retail, cafés and everyday convenience.
          </p>
        </Reveal>
      </div>
      <Reveal className="retail__strip" delay={100}>
        <div className="retail__img">
          <Image src="/images/b/front.jpg" alt="Ground-floor retail promenade of The Venezia" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "50% 97%" }} />
        </div>
      </Reveal>
      <div className="container">
        <Reveal className="retail__row" delay={150}>
          <div>
            <strong>15 retail shops</strong>
            <span>High visibility on S.G. Highway</span>
          </div>
          <div>
            <strong>Front-of-shop parking</strong>
            <span>Convenient for visitors and customers</span>
          </div>
          <div>
            <strong>Leasing &amp; sale</strong>
            <span>Units available on request</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
