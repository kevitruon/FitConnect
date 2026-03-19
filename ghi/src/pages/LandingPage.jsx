import { Link } from 'react-router-dom'
import {
    Dumbbell,
    Users,
    TrendingUp,
    Activity,
    ChevronRight,
    BarChart3,
    Zap,
    Shield,
} from 'lucide-react'

const features = [
    {
        icon: Dumbbell,
        color: 'from-blue-500 to-blue-600',
        title: 'Log Every Rep',
        desc: 'Track exercises, sets, weight, and reps with a fast, intuitive logging experience built for serious lifters.',
    },
    {
        icon: TrendingUp,
        color: 'from-purple-500 to-purple-600',
        title: 'Track Your Progress',
        desc: 'See total volume, workout history, and personal stats that show exactly how far you have come.',
    },
    {
        icon: Users,
        color: 'from-green-500 to-emerald-600',
        title: 'Train With Friends',
        desc: 'Follow training partners, see their workouts in your feed, and keep each other accountable.',
    },
    {
        icon: Zap,
        color: 'from-orange-500 to-orange-600',
        title: 'Stay Consistent',
        desc: 'Build streaks, monitor your weekly activity, and never miss a session again.',
    },
    {
        icon: BarChart3,
        color: 'from-pink-500 to-rose-600',
        title: 'Workout Analytics',
        desc: 'Dive deep into volume-per-exercise breakdowns and session summaries after every workout.',
    },
    {
        icon: Shield,
        color: 'from-indigo-500 to-indigo-600',
        title: 'Private & Secure',
        desc: 'Your data stays yours. Share only what you want with your fitness community.',
    },
]

const stats = [
    { label: 'Exercises in Library', value: '130+' },
    { label: 'Workouts Tracked', value: '10K+' },
    { label: 'Active Athletes', value: '500+' },
    { label: 'Sets Logged', value: '100K+' },
]

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* ── Hero ── */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
                {/* subtle grid texture */}
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 text-center">
                    {/* badge */}
                    <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-8">
                        <Zap size={14} className="text-blue-300" />
                        <span className="text-sm text-blue-200 font-medium">
                            Built for Bodybuilders
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                        Build.{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Track.
                        </span>{' '}
                        Connect.
                    </h1>

                    <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The fitness social platform designed for serious lifters.
                        Log workouts, follow training partners, and chase PRs
                        together.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-blue-500/30 transition-all"
                        >
                            <span>Start for Free</span>
                            <ChevronRight size={20} />
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-slate-500 text-slate-200 font-bold text-lg rounded-xl hover:border-blue-400 hover:text-blue-300 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* floating stat pills */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-3 text-center"
                            >
                                <p className="text-2xl font-extrabold text-white">
                                    {s.value}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg
                        viewBox="0 0 1440 60"
                        preserveAspectRatio="none"
                        className="w-full h-12 sm:h-16 fill-white"
                    >
                        <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" />
                    </svg>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                            Everything a serious lifter needs
                        </h2>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto">
                            No fluff. No filler. Just the tools that help you
                            train harder and recover smarter.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="group p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all bg-white"
                            >
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <f.icon className="text-white" size={22} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                            Get started in minutes
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Three steps to your first logged session.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                color: 'bg-blue-500',
                                title: 'Create your account',
                                desc: 'Sign up free in seconds — no credit card required.',
                            },
                            {
                                step: '02',
                                color: 'bg-purple-500',
                                title: 'Log your first workout',
                                desc: 'Pick exercises from our 130+ library and record every set.',
                            },
                            {
                                step: '03',
                                color: 'bg-green-500',
                                title: 'Connect & compete',
                                desc: 'Find training partners and keep each other accountable.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div
                                    className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                >
                                    <span className="text-white font-extrabold text-lg">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Activity className="text-white" size={32} />
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4">
                        Ready to level up your training?
                    </h2>
                    <p className="text-blue-200 text-lg mb-8">
                        Join hundreds of athletes already tracking their gains on
                        FitConnect.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center space-x-2 px-10 py-4 bg-white text-blue-700 font-bold text-lg rounded-xl hover:bg-blue-50 shadow-xl transition-all"
                    >
                        <span>Create Free Account</span>
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-slate-900 text-slate-400 py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Dumbbell className="text-white" size={16} />
                        </div>
                        <span className="font-bold text-white text-lg">
                            FitConnect
                        </span>
                    </div>
                    <p className="text-sm">
                        © {new Date().getFullYear()} FitConnect. Built for
                        lifters, by lifters.
                    </p>
                    <div className="flex space-x-6 text-sm">
                        <Link to="/login" className="hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="hover:text-white transition-colors">
                            Register
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
