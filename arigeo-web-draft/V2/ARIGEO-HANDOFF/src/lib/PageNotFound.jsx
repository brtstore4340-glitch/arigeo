import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-16">
      <div className="max-w-xl text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#df0c0c]">404</p>
        <h1 className="text-[clamp(2.4rem,4vw,4.8rem)] font-black tracking-[-0.07em] text-black">
          Page not found
        </h1>
        <p className="mt-4 text-[1rem] leading-7 text-black/72">
          The page you were looking for does not exist in this handoff tree.
        </p>
        <Link
          to="/en"
          className="mt-8 inline-flex items-center rounded-full bg-[#df0c0c] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c90808]"
        >
          Return home
        </Link>
      </div>
    </div>
  )
}
