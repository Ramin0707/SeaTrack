import Hero from '../components/Hero'
import ServicesSection from '../components/ServicesSection'
import GlobalNetwork from '../components/GlobalNetwork'
import TrackingSection from '../components/TrackingSection'
import DestinationsSection from '../components/DestinationsSection'
import WhySeaTrack from '../components/WhySeaTrack'
import CallToAction from '../components/CallToAction'

function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <GlobalNetwork />
      <TrackingSection />
      <DestinationsSection />
      <WhySeaTrack />
      <CallToAction />
    </>
  )
}

export default Home