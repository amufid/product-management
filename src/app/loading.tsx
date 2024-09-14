export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-3">
      <div className="loader"></div>
      <span className="text-xl">Loading <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></span>
    </div>
  )
}
