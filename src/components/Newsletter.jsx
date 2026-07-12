import { useState } from 'react'

export default function Newsletter() {
  const [sent, setSent] = useState(false)

  return (
    <section className="section news" id="contact">
      <div className="wrap">
        <span className="eyebrow">Scrisoarea</span>
        <h2>Un eseu la două săptămâni, direct în inbox.</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          <input
            type="email"
            required
            placeholder="adresa ta de email"
            aria-label="Adresa ta de email"
          />
          <button className="submit" type="submit">
            {sent ? 'Mulțumim' : 'Abonează-te'}
          </button>
        </form>
        <p className="note">
          {sent
            ? 'Verifică-ți inboxul pentru confirmare.'
            : 'Fără spam. Te poți dezabona oricând.'}
        </p>
      </div>
    </section>
  )
}
