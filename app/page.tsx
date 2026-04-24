import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import About from '@/components/About'
import Guests from '@/components/Guests'
import Episodes from '@/components/Episodes'
import GuestForm from '@/components/GuestForm'
import AskQuestion from '@/components/AskQuestion'
import Newsletter from '@/components/Newsletter'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Guests />
      <Episodes />
      <GuestForm />
      <AskQuestion />
      <Newsletter />
      <FAQ />
      <Footer />
    </main>
  )
}
