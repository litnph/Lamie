
import React from 'react';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Button } from '../components/common/Button';
import { FadeIn } from '../components/ui/FadeIn';

const MOCK_ORDERS = [
  { id: '#L9081', date: 'Oct 24, 2024', status: 'Delivered', items: 'Vintage Rose Bouquet', total: '650.000₫' },
  { id: '#L9112', date: 'Nov 02, 2024', status: 'Processing', items: 'Morning Dew (x2)', total: '900.000₫' },
];

export const MemberPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <div className="pt-32 min-h-screen pb-20 bg-cream-50">
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="md:col-span-3 space-y-8">
            <div className="text-center md:text-left">
              <div className="w-20 h-20 bg-mocha-200 rounded-full mx-auto md:mx-0 mb-4 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover" />
              </div>
              <h2 className="font-serif text-2xl text-mocha-900">Sophie Lenoir</h2>
              <p className="text-sm text-mocha-400 font-body">Member since 2023</p>
            </div>
            
            <nav className="flex flex-col gap-2 border-t border-cream-200 pt-6">
              {['Dashboard', 'My Orders', 'Addresses', 'Wishlist', 'Account Details'].map((item, i) => (
                <button key={item} className={`text-left py-2 px-4 rounded text-sm font-body transition-colors ${i === 0 ? 'bg-mocha-800 text-white' : 'text-mocha-500 hover:bg-cream-100'}`}>
                  {item}
                </button>
              ))}
              <button onClick={onLogout} className="text-left py-2 px-4 rounded text-sm font-body text-red-400 hover:bg-red-50 mt-4">
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9">
            <FadeIn>
              <h1 className="font-serif text-3xl text-mocha-900 mb-2">Hello, Sophie!</h1>
              <p className="font-body text-mocha-500 mb-10">From your account dashboard you can view your recent orders, manage your shipping and billing addresses.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 <div className="bg-white p-6 rounded-lg border border-cream-200 shadow-sm">
                    <span className="text-xs uppercase tracking-widest text-mocha-300">Total Orders</span>
                    <div className="text-4xl font-serif text-mocha-900 mt-2">12</div>
                 </div>
                 <div className="bg-white p-6 rounded-lg border border-cream-200 shadow-sm">
                    <span className="text-xs uppercase tracking-widest text-mocha-300">Wishlist</span>
                    <div className="text-4xl font-serif text-mocha-900 mt-2">5</div>
                 </div>
                 <div className="bg-white p-6 rounded-lg border border-cream-200 shadow-sm">
                    <span className="text-xs uppercase tracking-widest text-mocha-300">Reward Points</span>
                    <div className="text-4xl font-serif text-mocha-900 mt-2">450</div>
                 </div>
              </div>

              <h3 className="font-serif text-xl text-mocha-900 mb-6">Recent Orders</h3>
              <div className="bg-white rounded-lg border border-cream-200 overflow-hidden">
                <table className="w-full text-left font-body text-sm">
                  <thead className="bg-cream-100 text-mocha-400 uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="p-4 font-normal">Order</th>
                      <th className="p-4 font-normal">Date</th>
                      <th className="p-4 font-normal">Status</th>
                      <th className="p-4 font-normal">Total</th>
                      <th className="p-4 font-normal">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {MOCK_ORDERS.map(order => (
                      <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                        <td className="p-4 font-bold text-mocha-800">{order.id}</td>
                        <td className="p-4 text-mocha-500">{order.date}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span></td>
                        <td className="p-4 text-mocha-800">{order.total}</td>
                        <td className="p-4"><button className="text-mocha-800 underline hover:text-mocha-500">View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};
