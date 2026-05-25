import React, {
  useState,
  useEffect,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  motion,
} from 'framer-motion';

import {
  Eye,
  EyeOff,
  TrendingUp,
  Sparkles,
  Shield,
  Wallet,
  BarChart3,
} from 'lucide-react';

import {
  register,
  clearError,
} from '../redux/slices/authSlice';

import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const {
    loading,
    error,
  } = useSelector(
    (s) => s.auth
  );

  const [show, setShow] =
    useState(false);

  const [agree, setAgree] =
    useState(false);

  const [form, setForm] =
    useState({
      name: '',
      email: '',
      password: '',
    });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error)
      toast.error(error);
  }, [error]);

  const passwordStrength =
    form.password.length >=
    10
      ? 'Strong'
      : form.password
            .length >= 6
        ? 'Medium'
        : form.password
              .length > 0
          ? 'Weak'
          : '';

  const strengthColor =
    passwordStrength ===
    'Strong'
      ? 'text-green-400'
      : passwordStrength ===
          'Medium'
        ? 'text-yellow-400'
        : 'text-red-400';

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!agree)
        return toast.error(
          'Please accept terms'
        );

      if (
        form.password
          .length < 6
      ) {
        return toast.error(
          'Password must be at least 6 characters'
        );
      }

      const res =
        await dispatch(
          register(form)
        );

      if (
        res.meta
          .requestStatus ===
        'fulfilled'
      ) {
        toast.success(
          'Welcome to TradeX AI 🚀'
        );

        navigate(
          '/dashboard'
        );
      }
    };

  return (
    <div className="min-h-screen bg-[#060b16] text-white flex overflow-hidden">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-16 overflow-hidden">
        {/* GLOW */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl top-10 left-10" />

        <div className="absolute w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-3xl bottom-0 right-0" />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="relative z-10 max-w-xl"
        >
          {/* BRAND */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
              <TrendingUp
                size={30}
              />
            </div>

            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                TradeX AI
              </h1>

              <p className="text-slate-400 mt-1">
                Next Generation
                Trading Platform
              </p>
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-6xl font-black leading-tight mb-6">
            Start Your
            <br />
            Trading Journey.
          </h2>

          <p className="text-slate-400 text-lg leading-8 mb-10">
            Get AI-powered
            market insights,
            smart portfolio
            tracking, and
            ₹1,00,000 virtual
            balance to start
            trading instantly.
          </p>

          {/* FEATURES */}
          <div className="space-y-5">
            {[
              {
                icon:
                  Sparkles,
                title:
                  'AI Market Predictions',
              },

              {
                icon:
                  Shield,
                title:
                  'Secure Trading Environment',
              },

              {
                icon:
                  Wallet,
                title:
                  '₹1,00,000 Virtual Balance',
              },

              {
                icon:
                  BarChart3,
                title:
                  'Advanced Portfolio Analytics',
              },
            ].map(
              (
                item,
                i
              ) => {
                const Icon =
                  item.icon;

                return (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        i *
                        0.12,
                    }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                      <Icon
                        size={
                          22
                        }
                        className="text-cyan-400"
                      />
                    </div>

                    <span className="font-semibold text-lg">
                      {
                        item.title
                      }
                    </span>
                  </motion.div>
                );
              }
            )}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="w-full max-w-md relative z-10"
        >
          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <TrendingUp
                size={24}
              />
            </div>

            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TradeX AI
            </h1>
          </div>

          {/* CARD */}
          <div className="bg-white/[0.04] border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-3">
                Create Account
              </h2>

              <p className="text-slate-400">
                Join the AI-powered
                trading revolution
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >
              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={
                    form.name
                  }
                  onChange={(
                    e
                  ) =>
                    setForm(
                      (
                        f
                      ) => ({
                        ...f,
                        name:
                          e
                            .target
                            .value,
                      })
                    )
                  }
                  placeholder="Rohit Kamble"
                  className="w-full h-14 px-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  required
                  value={
                    form.email
                  }
                  onChange={(
                    e
                  ) =>
                    setForm(
                      (
                        f
                      ) => ({
                        ...f,
                        email:
                          e
                            .target
                            .value,
                      })
                    )
                  }
                  placeholder="you@example.com"
                  className="w-full h-14 px-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={
                      show
                        ? 'text'
                        : 'password'
                    }
                    required
                    value={
                      form.password
                    }
                    onChange={(
                      e
                    ) =>
                      setForm(
                        (
                          f
                        ) => ({
                          ...f,
                          password:
                            e
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full h-14 px-4 pr-14 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none text-white placeholder:text-slate-500 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShow(
                        (
                          s
                        ) => !s
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {show ? (
                      <EyeOff
                        size={
                          20
                        }
                      />
                    ) : (
                      <Eye
                        size={
                          20
                        }
                      />
                    )}
                  </button>
                </div>

                {/* STRENGTH */}
                {passwordStrength && (
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      Password
                      Strength
                    </span>

                    <span
                      className={`text-sm font-semibold ${strengthColor}`}
                    >
                      {
                        passwordStrength
                      }
                    </span>
                  </div>
                )}
              </div>

              {/* TERMS */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    agree
                  }
                  onChange={(
                    e
                  ) =>
                    setAgree(
                      e.target
                        .checked
                    )
                  }
                  className="mt-1 accent-cyan-400"
                />

                <span className="text-sm text-slate-400 leading-6">
                  I agree to
                  the{' '}
                  <span className="text-cyan-400">
                    Terms of
                    Service
                  </span>{' '}
                  and{' '}
                  <span className="text-cyan-400">
                    Privacy
                    Policy
                  </span>
                  .
                </span>
              </label>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={
                  loading ||
                  !agree
                }
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-cyan-500/20 disabled:opacity-60"
              >
                {loading
                  ? 'Creating Account...'
                  : 'Create Account →'}
              </button>
            </form>

            {/* BONUS */}
            <div className="mt-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
              <p className="text-sm text-slate-300">
                Signup Bonus
              </p>

              <p className="mt-2 text-2xl font-black text-cyan-400">
                ₹1,00,000
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Virtual Trading
                Balance
              </p>
            </div>

            {/* FOOTER */}
            <p className="text-center text-slate-400 mt-8">
              Already have an
              account?{' '}
              <Link
                to="/login"
                className="text-cyan-400 font-semibold hover:text-cyan-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}