'use client';

export function Particles() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
      >
        <source src="/particles.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#020817]/60 backdrop-blur-[2px]"></div>
    </div>
  );
}
