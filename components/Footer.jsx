import { Recycle, Users } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ScrapSmart</span>
            </div>
            <p className="text-slate-400">
              Australia's most trusted scrap marketplace, connecting sellers with verified dealers nationwide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <div className="space-y-2 text-slate-400">
              <div>How It Works</div>
              <div>Pricing</div>
              <div>For Dealers</div>
              <div>Safety</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-slate-400">
              <div>Help Center</div>
              <div>Contact Us</div>
              <div>Community</div>
              <div>Status</div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-slate-400">
              <div>About</div>
              <div>Blog</div>
              <div>Careers</div>
              <div>Press</div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2025 ScrapSmart. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
