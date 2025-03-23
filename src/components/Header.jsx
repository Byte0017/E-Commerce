function Header() {
  return (
    <header className="text-center relative py-10 animate-slide-in">
      {/* Decorative Elements */}
      <div className="absolute -top-20 -left-40 w-56 h-56 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -top-20 -right-40 w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-1 bg-button-gradient rounded-full opacity-20"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-premium-gold/10 rounded-full blur-2xl animate-float"></div>

      {/* Main Title */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-button-gradient tracking-tight relative z-10">
        Vocal Sync
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-lg md:text-xl lg:text-2xl text-neutral-light font-medium max-w-2xl mx-auto relative z-10">
        A Premium Voice-Powered Task Manager for the Modern Professional
      </p>

      {/* Tagline */}
      <p className="mt-3 text-sm md:text-base text-neutral-light/70 uppercase tracking-widest">
        Redefine Productivity
      </p>

      {/* Accent Line */}
      <div className="mt-6 w-36 h-1 mx-auto bg-button-gradient rounded-full shadow-glow"></div>

      {/* Feature Highlights */}
      <div className="mt-8 flex justify-center gap-8 text-sm md:text-base text-neutral-light flex-wrap">
        <span className="flex items-center gap-3 bg-neutral/10 px-4 py-2 rounded-full shadow-md">
          <span className="material-icons text-primary">mic</span>
          Advanced Speech Recognition
        </span>
        <span className="flex items-center gap-3 bg-neutral/10 px-4 py-2 rounded-full shadow-md">
          <span className="material-icons text-accent">sync</span>
          Real-Time Sync
        </span>
        <span className="flex items-center gap-3 bg-neutral/10 px-4 py-2 rounded-full shadow-md">
          <span className="material-icons text-highlight">cloud</span>
          Cloud Integration
        </span>
      </div>

      {/* Call to Action */}
      <div className="mt-10">
        <button className="premium-btn px-8 text-base font-medium flex items-center gap-2 mx-auto hover-scale">
          <span className="material-icons text-lg">star</span>
          Try Premium Now
        </button>
      </div>

      {/* Glass Overlay */}
      <div className="absolute inset-0 glass-effect rounded-3xl -z-10 opacity-60"></div>

      {/* Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 1024px) {
          h1 {
            font-size: 4rem;
          }
          p {
            max-width: 80%;
          }
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 3rem;
          }
          p {
            font-size: 1rem;
            max-width: 90%;
          }
          .mt-8 {
            margin-top: 1.5rem;
            gap: 1rem;
            flex-direction: column;
          }
          button {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
        @media (max-width: 640px) {
          h1 {
            font-size: 2.5rem;
          }
          p {
            font-size: 0.875rem;
          }
          .mt-6 {
            margin-top: 1rem;
          }
          .w-36 {
            width: 6rem;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;