
import React from 'react';
import { FlowerProduct } from '../features/product/product.type';
import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Button } from '../components/common/Button';
import { formatVndCurrency } from '../utils/displayFormatters';

const AdminPage: React.FC<{ products: FlowerProduct[], onLogout: () => void }> = ({ products, onLogout }) => (
  <div className="pt-32 min-h-screen pb-20">
    <SectionWrapper>
      <div className="flex justify-between items-center mb-12 border-b border-cream-200 pb-8">
        <div>
          <h1 className="font-serif text-4xl text-mocha-900">Dashboard</h1>
          <p className="text-sm text-mocha-300 mt-2 font-body">Manage Lamie inventory</p>
        </div>
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </div>
      <div className="bg-white rounded border border-cream-200 shadow-sm overflow-hidden">
        <table className="w-full text-left font-body">
          <thead className="bg-cream-100 text-xs uppercase tracking-widest text-mocha-300">
            <tr>
               <th className="p-5 font-bold">Image</th>
               <th className="p-5 font-bold">Name</th>
               <th className="p-5 font-bold">Category</th>
               <th className="p-5 font-bold">Price</th>
               <th className="p-5 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                <td className="p-5"><img src={p.images[0]?.url} alt={p.images[0]?.alt || p.name} className="w-12 h-16 object-cover rounded" /></td>
                <td className="p-5 font-serif text-mocha-900 text-lg">{p.name}</td>
                <td className="p-5 text-sm text-mocha-500 uppercase tracking-tighter">{p.category.name}</td>
                <td className="p-5 text-mocha-800">{formatVndCurrency(p.price)}</td>
                <td className="p-5"><button className="text-xs text-mocha-400 hover:text-mocha-800 uppercase font-bold">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  </div>
);

export default AdminPage;
