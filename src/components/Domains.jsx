import { domains } from '../data.js'

export default function Domains() {
  return (
    <section className="section tinted" id="domenii">
      <div className="wrap">
        <div className="shead">
          <div className="lead">
            <span className="eyebrow">Câmpuri de cercetare</span>
            <h2>Domenii</h2>
          </div>
          <a className="more" href="#domenii">Explorează →</a>
        </div>
        <div className="domains">
          {domains.map((d) => (
            <div className="domain" key={d.name} tabIndex={0}>
              <span className="n">{d.name}</span>
              <span className="d">{d.desc}</span>
              <span className="c">{d.count} texte</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
