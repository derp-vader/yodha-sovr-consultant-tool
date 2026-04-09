export function Footer() {
  return (
    <footer className="w-full py-8 px-6 border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-3">
        <div className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          SOVR
        </div>
        <p className="text-white text-sm font-medium tracking-wide">
          Premium European Digital Sovereignty Assessment Platform
        </p>
        <div className="flex items-center gap-4 sm:gap-6 text-white text-xs mt-2 opacity-80 font-medium">
          <span>© 2026 SOVR</span>
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Security</a>
        </div>
      </div>
    </footer>
  );
}
