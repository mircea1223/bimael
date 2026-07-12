import portrait from '../assets/portrait-central.png'

export default function Medallion() {
  return (
    <div className="medallion">
      <img
        className="medallion-portrait"
        src={portrait}
        alt="Portret ilustrat alb-negru"
      />
    </div>
  )
}
