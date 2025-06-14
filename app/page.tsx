"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowDown,
  PlayCircle,
  XIcon,
  CheckCircle,
  BarChart,
  ShieldCheck,
  Users2,
  Zap,
  Package,
  Briefcase,
} from "lucide-react"
import Image from "next/image"

// Placeholder for card images - replace with actual paths or dynamic generation
const cardImageSplat1 = "/placeholder.svg?width=350&height=218"
const cardImageSplat2 = "/placeholder.svg?width=350&height=218"
const cardImageSplat3 = "/placeholder.svg?width=350&height=218"

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="text-brand-orange mb-4">{icon}</div>
    <h3 className="font-heading text-xl font-semibold text-brand-navy mb-2">{title}</h3>
    <p className="text-hero-text-secondary text-sm">{description}</p>
  </div>
)

const TierCard = ({
  title,
  price,
  features,
  popular,
  cta,
}: { title: string; price: string; features: string[]; popular?: boolean; cta: string }) => (
  <div
    className={`bg-white p-8 rounded-xl shadow-xl border ${popular ? "border-brand-orange ring-2 ring-brand-orange" : "border-gray-200"} flex flex-col`}
  >
    {popular && (
      <div className="bg-brand-orange text-white text-xs font-semibold px-3 py-1 rounded-full self-start mb-4">
        POPULAR
      </div>
    )}
    <h3 className="font-heading text-2xl font-bold text-brand-navy mb-2">{title}</h3>
    <p className="text-4xl font-extrabold text-brand-navy mb-1">
      {price}
      <span className="text-base font-normal text-hero-text-secondary">/month</span>
    </p>
    <p className="text-sm text-hero-text-secondary mb-6">Billed annually or pay monthly.</p>
    <ul className="space-y-3 mb-8 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-hero-text-secondary">
          <CheckCircle className="h-5 w-5 text-brand-orange mr-2 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    <Button
      size="lg"
      className={`${popular ? "bg-brand-orange hover:bg-brand-orange/90 text-white" : "bg-brand-navy hover:bg-brand-navy/90 text-white"} w-full py-3 text-md`}
    >
      {cta}
    </Button>
  </div>
)

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-brand-lightPink">
      {/* Navbar */}
      <nav className="bg-brand-navy text-navbar-text sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="bg-brand-orange p-1.5 rounded-lg">
              <XIcon className="h-5 w-5 text-white transform rotate-45" />
            </div>
            <span className="font-heading text-2xl font-bold">KidsBank</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {["Features", "How it Works", "Pricing", "For Parents", "Blog"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-brand-orange transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              className="text-navbar-text hover:bg-white/10 hover:text-white px-4 py-2 text-sm"
              onClick={() => router.push("/auth/login-options")}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-4 py-2 text-sm"
              onClick={() => router.push("/auth/parent")} // Parent signup is primary "Get Started"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="hero" className="flex-grow container mx-auto px-6 pt-20 pb-12 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-hero-text-primary mb-6 leading-tight">
            <span className="text-hero-accent">Smart Debit Card</span>
            <br />
            for Teens in Pakistan
          </h1>
          <p className="text-lg text-hero-text-secondary mb-10 max-w-lg mx-auto lg:mx-0">
            Empower your teen with financial independence and literacy. KidsBank provides a safe way to learn money
            management, earn, and save.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-brand-navy text-white hover:bg-brand-navy/90 w-full sm:w-auto px-10 py-3.5 text-lg"
              onClick={() => router.push("/auth/parent")}
            >
              Get Your Card
            </Button>
            <Button variant="link" className="text-brand-navy hover:text-hero-accent text-lg font-medium">
              Watch Quick Tutorial <PlayCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-20 hidden lg:flex items-center space-x-3 text-hero-text-secondary/80">
            <ArrowDown className="h-8 w-8 animate-bounce" />
            <span className="text-sm tracking-wider font-medium">SCROLL TO EXPLORE</span>
          </div>
        </div>

        <div className="lg:w-1/2 relative flex justify-center items-center h-[350px] sm:h-[450px] lg:h-auto">
          <div className="relative w-full max-w-xl h-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-[55%] -translate-y-[45%] w-[280px] h-[175px] sm:w-[320px] sm:h-[200px] md:w-[380px] md:h-[237px] z-10">
              <Image
                src={cardImageSplat1 || "/placeholder.svg"}
                alt="KidsBank Debit Card Beige"
                width={380}
                height={237}
                className="rounded-xl shadow-2xl object-cover transform rotate-[-8deg] transition-transform hover:scale-105 hover:rotate-[-5deg]"
                priority
              />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-[45%] -translate-y-[55%] w-[280px] h-[175px] sm:w-[320px] sm:h-[200px] md:w-[380px] md:h-[237px] z-20">
              <Image
                src={cardImageSplat2 || "/placeholder.svg"}
                alt="KidsBank Debit Card Teal"
                width={380}
                height={237}
                className="rounded-xl shadow-2xl object-cover transform rotate-[5deg] transition-transform hover:scale-105 hover:rotate-[2deg]"
                priority
              />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[50%] w-[280px] h-[175px] sm:w-[320px] sm:h-[200px] md:w-[380px] md:h-[237px] z-0 opacity-70">
              <Image
                src={cardImageSplat3 || "/placeholder.svg"}
                alt="KidsBank Debit Card Dark"
                width={380}
                height={237}
                className="rounded-xl shadow-2xl object-cover transform rotate-[12deg] transition-transform hover:scale-105 hover:rotate-[10deg]"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-brand-navy">
              Everything Your Teen Needs to Succeed
            </h2>
            <p className="text-lg text-hero-text-secondary mt-3 max-w-2xl mx-auto">
              KidsBank offers a comprehensive suite of tools for financial learning and smart money management.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap size={32} />}
              title="Instant Prepaid Card"
              description="Safe and secure digital & physical card for teens, easily topped up by parents."
            />
            <FeatureCard
              icon={<ShieldCheck size={32} />}
              title="Parental Controls"
              description="Set allowances, approve spending, assign tasks, and monitor financial progress."
            />
            <FeatureCard
              icon={<BarChart size={32} />}
              title="Gamified Learning"
              description="Fun, interactive lessons in Urdu & English to build strong financial habits."
            />
            <FeatureCard
              icon={<Users2 size={32} />}
              title="Chore & Reward System"
              description="Kids earn money by completing tasks, fostering responsibility and work ethic."
            />
            <FeatureCard
              icon={<Package size={32} />}
              title="Savings Goals"
              description="Help teens set and achieve savings goals for things they want."
            />
            <FeatureCard
              icon={<Briefcase size={32} />}
              title="Halal Finance Principles"
              description="Education aligned with cultural values, promoting ethical financial practices."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-brand-lightPink">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-brand-navy">
              Get Started in 3 Simple Steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="bg-brand-orange text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">
                1
              </div>
              <h3 className="font-heading text-xl font-semibold text-brand-navy mb-2">Parents Sign Up</h3>
              <p className="text-hero-text-secondary text-sm">
                Create your parent account and add your teen(s) to KidsBank.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brand-orange text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">
                2
              </div>
              <h3 className="font-heading text-xl font-semibold text-brand-navy mb-2">Fund & Set Tasks</h3>
              <p className="text-hero-text-secondary text-sm">
                Top up their prepaid card, set allowances, and assign chores with rewards.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-brand-orange text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md">
                3
              </div>
              <h3 className="font-heading text-xl font-semibold text-brand-navy mb-2">Teens Learn & Grow</h3>
              <p className="text-hero-text-secondary text-sm">
                Kids log in to manage money, complete tasks, play games, and save!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Tiers Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-brand-navy">Choose Your Plan</h2>
            <p className="text-lg text-hero-text-secondary mt-3 max-w-2xl mx-auto">
              Simple, transparent pricing to fit your family's needs.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            <TierCard
              title="Starter"
              price="Free"
              features={[
                "1 Child Account",
                "Basic Financial Lessons",
                "Digital Card Only",
                "Standard Parental Controls",
                "Community Support",
              ]}
              cta="Get Started Free"
            />
            <TierCard
              title="Growth"
              price="Rs. 499"
              features={[
                "Up to 3 Child Accounts",
                "Full Financial Curriculum",
                "Physical Card Option",
                "Advanced Parental Controls",
                "Gamified Rewards",
                "Priority Support",
              ]}
              popular
              cta="Choose Growth Plan"
            />
            <TierCard
              title="Family Pro"
              price="Rs. 999"
              features={[
                "Up to 5 Child Accounts",
                "All Growth Features",
                "Custom Card Designs",
                "Investment Modules (Coming Soon)",
                "Family Financial Planning Tools",
                "Dedicated Account Manager",
              ]}
              cta="Go Family Pro"
            />
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section id="business-model" className="py-16 lg:py-24 bg-brand-lightPink">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-brand-navy">
              Our Commitment & Business Model
            </h2>
            <p className="text-lg text-hero-text-secondary mt-3 max-w-2xl mx-auto">
              We believe in transparency and empowering families. Here’s how KidsBank operates.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-heading text-xl font-semibold text-brand-navy mb-2">Freemium Model</h3>
              <p className="text-hero-text-secondary text-sm">
                KidsBank offers a robust free tier allowing families to experience core features like digital wallets,
                basic financial lessons, and parental controls for one child. This ensures accessibility for everyone.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-heading text-xl font-semibold text-brand-navy mb-2">Subscription Tiers</h3>
              <p className="text-hero-text-secondary text-sm">
                For families needing more, our affordable premium subscriptions (Growth, Family Pro) unlock advanced
                features, support for multiple children, physical cards, and enhanced learning content. This is our
                primary revenue source, allowing us to continuously improve the platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-heading text-xl font-semibold text-brand-navy mb-2">Value-Added Services (Future)</h3>
              <p className="text-hero-text-secondary text-sm">
                In the future, we may introduce optional value-added services like custom card designs or specialized
                financial workshops, which could involve small, transparent fees. We are committed to no hidden charges.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-heading text-xl font-semibold text-brand-navy mb-2">
                Partnerships (Ethical & Relevant)
              </h3>
              <p className="text-hero-text-secondary text-sm">
                We may explore ethical partnerships with educational institutions or financial service providers that
                align with our mission to enhance financial literacy. Any such partnerships will be clearly disclosed.
                Your data privacy is paramount and will not be compromised.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-10 bg-brand-navy text-navbar-text/70 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-brand-orange p-1.5 rounded-lg">
              <XIcon className="h-5 w-5 text-white transform rotate-45" />
            </div>
            <span className="font-heading text-xl font-bold text-white">KidsBank</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} KidsBank Pakistan. Empowering the next generation.
          </p>
          <p className="text-xs mt-1">Built for educational and demonstration purposes.</p>
        </div>
      </footer>
    </div>
  )
}
