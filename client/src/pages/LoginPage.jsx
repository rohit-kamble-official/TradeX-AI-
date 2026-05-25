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
  Shield,
  Sparkles,
  BarChart3,
} from 'lucide-react';

import {
  login,
  clearError,
} from '../redux/slices/authSlice';

import toast from 'react-hot-toast';

export default function LoginPage() {
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

  const [form, setForm] =
    useState({
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

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const res =
        await dispatch(
          login(form)
        );

      if (
        res.meta
          .requestStatus ===
        'fulfilled'
      ) {
        toast.success(
          'Welcome back!'
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
        {/* BG GLOW */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl top-10 left-10" />

        <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl bottom-0 right-0" />

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
                AI-Powered
                Trading Platform
              </p>
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-6xl font-black leading-tight mb-6">
            Smart Trading
            <br />
            Starts Here.
          </h2>

          <p className="text-slate-400 text-lg leading-8 mb-10">
            Analyze markets,
            track portfolios,
            and get AI-powered
            investment insights
            in real time.
          </p>

          {/* FEATURES */}
          <div className="space-y-5">
            {[
              {
                icon:
                  Sparkles,
                title:
                  'AI Market Intelligence',
              },

              {
                icon:
                  Shield,
                title:
                  'Secure Portfolio Management',
              },

              {
                icon:
                  BarChart3,
                title:
                  'Advanced Trading Analytics',
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
                        0.15,
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
                Welcome Back
              </h2>

              <p className="text-slate-400">
                Sign in to your
                AI trading
                dashboard
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >
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
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-300">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot?
                  </Link>
                </div>

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
                    placeholder="••••••••"
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
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={
                  loading
                }
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-cyan-500/20"
              >
                {loading
                  ? 'Signing In...'
                  : 'Sign In →'}
              </button>
            </form>

            {/* DEMO */}
            <div className="mt-6 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
              <p className="text-sm text-slate-300">
                Demo Account
              </p>

              <p className="mt-2 text-cyan-400 font-semibold">
                demo@tradex.ai
              </p>

              <p className="text-cyan-400 font-semibold">
                demo1234
              </p>
            </div>

            {/* FOOTER */}
            <p className="text-center text-slate-400 mt-8">
              Don’t have an
              account?{' '}
              <Link
                to="/register"
                className="text-cyan-400 font-semibold hover:text-cyan-300"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}