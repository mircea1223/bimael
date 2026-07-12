import { events } from '../data.js'

const MONTHS = {
  ianuarie: 'ian', februarie: 'feb', martie: 'mar', aprilie: 'apr',
  mai: 'mai', iunie: 'iun', iulie: 'iul', august: 'aug',
  septembrie: 'sep', octombrie: 'oct', noiembrie: 'nov', decembrie: 'dec',
}

// „18 iulie 2026 · 19:00" → bloc de dată editorial (ziuă, lună) + oră.
function parseWhen(when) {
  const [datePart, time] = when.split(' · ')
  const [day, month] = datePart.split(' ')
  return { day, mon: MONTHS[month] ?? month.slice(0, 3), time }
}

function EventRow({ e }) {
  const { day, mon, time } = parseWhen(e.when)
  return (
    <article
      className={`evt ${e.kind === 'webinar' ? 'webinar' : ''}`}
      tabIndex={0}
      aria-label={`${e.type}: ${e.title}, ${e.when}`}
    >
      <div className="date" aria-hidden="true">
        <span className="day">{day}</span>
        <span className="mon">{mon}</span>
      </div>
      <div className="body">
        <div className="meta">
          <span className="type">{e.type}</span>
          <span className="time">{time}</span>
        </div>
        <h4>{e.title}</h4>
      </div>
    </article>
  )
}

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Agenda() {
  // Lista este dublată pentru derularea continuă (loop fără cusătură);
  // fără mișcare, lista rămâne simplă și derulabilă.
  const loop = prefersReduced ? events : [...events, ...events]
  return (
    <aside className="agenda" aria-label="Evenimente și webinarii">
      <div className="ahead">
        <span className="eyebrow lbl">Agendă</span>
        <span className="cnt">{events.length} întâlniri</span>
      </div>
      <div className="frame">
        <div className="ticker">
          <div className="track">
            {loop.map((e, i) => (
              <EventRow key={i} e={e} />
            ))}
          </div>
        </div>
      </div>
      <a className="alink" href="#agenda">
        Toată agenda <span aria-hidden="true">↗</span>
      </a>
    </aside>
  )
}
