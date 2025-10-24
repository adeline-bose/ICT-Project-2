import { ArrowRight, Recycle, Shield, DollarSign, Users, Leaf, Star, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const stats = [
    { number: '10K+', label: 'Items Recycled' },
    { number: '500+', label: 'Verified Dealers' },
    { number: '95%', label: 'Customer Satisfaction' },
    { number: '2.5M', label: 'Tonnes Diverted' }
  ];
  const navigate=useNavigate()
  const handleButtonClick=()=>{
    navigate('/auth')
    window.scrollTo(0, 0);
  }
  const handleBuyerClick=()=>{
    navigate('/buyer')
    window.scrollTo(0, 0);
  }
  const handleSellerClick=()=>{
    navigate('/seller')
    window.scrollTo(0, 0);
  }

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Fair Market Pricing',
      description: 'Get the best value for your scrap with real-time market rates and competitive bidding from verified dealers.',
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trusted & Secure',
      description: 'All dealers are verified and transactions are protected with our secure payment system and quality guarantee.',
      gradient: 'from-blue-400 to-cyan-600'
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: 'Environmental Impact',
      description: 'Track your positive environmental contribution with detailed impact reports and carbon footprint reduction.',
      gradient: 'from-purple-400 to-indigo-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Small Business Owner',
      content: 'ScrapSmart helped me turn my workshop waste into profit. The process is so simple and the dealers are reliable.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Thompson',
      role: 'Collector',
      content: 'Finally, a platform that gives fair prices for electronics. Made $2,000 last month from old components!',
      rating: 5,
      avatar: '👨‍🔧'
    },
    {
      name: 'GreenTech Recycling',
      role: 'Verified Dealer',
      content: 'The quality of materials and the streamlined process makes ScrapSmart our go-to sourcing platform.',
      rating: 5,
      avatar: '🏭'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm font-medium">
                  <Leaf className="w-4 h-4 mr-2" />
                  Australia's #1 Scrap Marketplace
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Turn Your
                  <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Scrap</span>
                  <br />Into Cash
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl">
                  Connect with verified dealers, get fair market prices, and make a positive environmental impact. 
                  The smart way to sell your metals, electronics, and recyclables.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleButtonClick} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center group">
                  Start Selling Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-slate-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-800 transition-all flex items-center justify-center group">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-white">{stat.number}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Recent Sale</h3>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Live</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      🔩
                    </div>
                    <div>
                      <div className="text-white font-medium">Copper Wire - 50kg</div>
                      <div className="text-slate-400 text-sm">Sold 2 minutes ago</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-green-400 font-bold text-lg">$425</div>
                      <div className="text-xs text-slate-400">$8.50/kg</div>
                    </div>
                  </div>
                  <div className="h-px bg-slate-700"></div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      📱
                    </div>
                    <div>
                      <div className="text-white font-medium">Old Smartphones x12</div>
                      <div className="text-slate-400 text-sm">Sold 5 minutes ago</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-green-400 font-bold text-lg">$180</div>
                      <div className="text-xs text-slate-400">$15 each</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Why Choose ScrapSmart?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We've revolutionized the scrap industry with technology, transparency, and trust
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl blur-xl"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 text-white`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Simple Process, Maximum Value
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              From listing to payment, we've made selling scrap effortless
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'List Your Items', desc: 'Upload photos and describe your scrap materials', icon: '📸' },
              { step: '02', title: 'Get Quotes', desc: 'Verified dealers bid on your items competitively', icon: '💰' },
              { step: '03', title: 'Choose Best Offer', desc: 'Compare offers and select the best deal', icon: '✅' },
              { step: '04', title: 'Get Paid', desc: 'Secure pickup and instant payment', icon: '🏦' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-300">{item.desc}</p>
                {index < 3 && (
                  <ChevronRight className="w-6 h-6 text-slate-600 mx-auto mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See what our community says about their ScrapSmart experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-400/30 rounded-3xl p-12 space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Turn Waste into Wealth?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of Australians who are already earning money while helping the environment
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={handleSellerClick} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center group">
                Start Selling Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={handleBuyerClick} className="border-2 border-slate-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-slate-800 transition-all flex items-center justify-center">
                <Users className="w-5 h-5 mr-2" />
                Join as Dealer
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
