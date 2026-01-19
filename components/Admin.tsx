import React, { useState, useEffect } from 'react';
import { FlowerProduct } from '../types';
import { SectionWrapper, Button, LeafIcon } from './ui/Base';

interface AdminProps {
  products: FlowerProduct[];
  setProducts: (products: FlowerProduct[]) => void;
  onExit: () => void;
  onLogout: () => void;
}

const emptyProduct: FlowerProduct = {
  id: '',
  name: '',
  price: '',
  category: 'Thường Ngày',
  image: '',
  description: '',
  additionalImages: []
};

export const Admin: React.FC<AdminProps> = ({ products, setProducts, onExit, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<FlowerProduct>(emptyProduct);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Controls the Modal visibility
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFormOpen]);

  const handleEdit = (product: FlowerProduct) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleCreateNew = () => {
    setCurrentProduct(emptyProduct);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      setNotification('Đã xóa sản phẩm');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProduct.id) {
      // Update existing
      const updated = products.map(p => p.id === currentProduct.id ? currentProduct : p);
      setProducts(updated);
      setNotification('Đã cập nhật sản phẩm');
    } else {
      // Create new
      const newProduct = { ...currentProduct, id: Date.now().toString() };
      setProducts([newProduct, ...products]);
      setNotification('Đã tạo sản phẩm mới');
    }
    
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setCurrentProduct(emptyProduct);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProduct({ ...currentProduct, image: e.target.value });
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by new line or comma and clean up
    const urls = e.target.value.split(/[\n,]+/).map(url => url.trim()).filter(url => url.length > 0);
    setCurrentProduct({ ...currentProduct, additionalImages: urls });
  };

  return (
    <div className="pt-24 min-h-screen bg-cream-50 pb-20">
      <SectionWrapper>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-mocha-900">Quản Lý Cửa Hàng</h1>
            <p className="font-body text-mocha-500 text-sm mt-2">Quản lý kho hoa và sản phẩm của bạn</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline" onClick={onExit} className="flex-1 md:flex-none border-mocha-300 text-mocha-500 hover:bg-cream-100 hover:text-mocha-800 text-xs py-2">
               Cửa hàng
             </Button>
             <Button onClick={onLogout} className="flex-1 md:flex-none bg-mocha-800 text-white hover:bg-mocha-900 text-xs py-2">
               Đăng xuất
             </Button>
          </div>
        </div>

        {notification && (
          <div className="fixed top-24 right-6 left-6 md:left-auto bg-mocha-800 text-cream-100 px-6 py-4 rounded shadow-lg z-50 animate-fade-in-up text-center md:text-left">
            {notification}
          </div>
        )}

        {/* Add New Button */}
        <div className="mb-8">
            <button 
                onClick={handleCreateNew}
                className="w-full md:w-auto px-8 py-3 bg-mocha-800 text-cream-100 rounded hover:bg-mocha-900 transition-colors shadow-md flex items-center justify-center gap-2 font-serif"
            >
                <span>+</span> Thêm Hoa Mới
            </button>
        </div>

        {/* MODAL POPUP FORM */}
        {isFormOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-mocha-900/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
                
                {/* Modal Content */}
                <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-fade-in-up">
                    <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex justify-between items-center z-10">
                        <h3 className="font-serif text-2xl text-mocha-900">
                            {currentProduct.id ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                        </h3>
                        <button onClick={handleCloseModal} className="text-mocha-400 hover:text-mocha-800 p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                            <label className="block text-xs uppercase tracking-widest text-mocha-300 mb-2">Tên Hoa</label>
                            <input 
                                required
                                value={currentProduct.name}
                                onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                                className="w-full border border-cream-200 rounded p-3 focus:outline-none focus:border-mocha-500 bg-transparent font-serif text-mocha-800 text-lg"
                                placeholder="Ví dụ: Sương Sớm"
                            />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-mocha-300 mb-2">Giá</label>
                                <input 
                                required
                                value={currentProduct.price}
                                onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})}
                                className="w-full border border-cream-200 rounded p-3 focus:outline-none focus:border-mocha-500 bg-transparent font-body"
                                placeholder="0₫"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-mocha-300 mb-2">Danh Mục</label>
                                <div className="relative">
                                    <select 
                                    value={currentProduct.category}
                                    onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                                    className="w-full border border-cream-200 rounded p-3 appearance-none focus:outline-none focus:border-mocha-500 bg-transparent font-body text-mocha-800"
                                    >
                                    {['Thường Ngày', 'Dịp Đặc Biệt', 'Tiệc Cưới', 'Kỷ Niệm', 'Hoa Khô'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-mocha-500">
                                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                            </div>

                            <div>
                            <label className="block text-xs uppercase tracking-widest text-mocha-300 mb-2">Link Ảnh Chính</label>
                            <input 
                                required
                                value={currentProduct.image}
                                onChange={handleImageChange}
                                className="w-full border border-cream-200 rounded p-3 focus:outline-none focus:border-mocha-500 bg-transparent font-body text-xs"
                                placeholder="https://..."
                            />
                            {currentProduct.image && (
                                <div className="mt-2 h-32 w-full rounded overflow-hidden border border-cream-200 relative bg-cream-50">
                                <img src={currentProduct.image} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            )}
                            </div>

                            <div>
                            <label className="block text-xs uppercase tracking-widest text-mocha-300 mb-2">Link Ảnh Phụ</label>
                            <textarea 
                                value={currentProduct.additionalImages?.join('\n')}
                                onChange={handleAdditionalImagesChange}
                                className="w-full border border-cream-200 p-3 focus:outline-none focus:border-mocha-500 bg-transparent font-body text-xs rounded"
                                placeholder="Mỗi dòng một link ảnh"
                                rows={3}
                            />
                            </div>

                            <div>
                            <label className="block text-xs uppercase tracking-widest text-mocha-300 mb-2">Mô Tả</label>
                            <textarea 
                                required
                                value={currentProduct.description}
                                onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                                className="w-full border border-cream-200 p-3 focus:outline-none focus:border-mocha-500 bg-transparent font-body text-sm rounded resize-none"
                                rows={4}
                            />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-cream-100">
                            <Button type="submit" className="flex-1 rounded-md py-3 text-sm">{currentProduct.id ? 'Cập Nhật' : 'Tạo Mới'}</Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleCloseModal}
                                className="rounded-md py-3 text-sm"
                            >
                                Hủy Bỏ
                            </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}

        {/* List Section */}
        <div className="bg-white rounded-lg border border-cream-200 shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 border-b border-cream-200 bg-cream-100/50 flex justify-between items-center">
                <h3 className="font-serif text-lg md:text-xl text-mocha-900">Kho Hoa ({products.length})</h3>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-cream-50 text-mocha-300 text-xs uppercase tracking-widest">
                    <tr>
                    <th className="px-6 py-4 font-normal">Ảnh</th>
                    <th className="px-6 py-4 font-normal">Tên Hoa</th>
                    <th className="px-6 py-4 font-normal">Danh Mục</th>
                    <th className="px-6 py-4 font-normal">Giá</th>
                    <th className="px-6 py-4 font-normal text-right">Thao Tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                    {products.map(p => (
                    <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                        <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        </td>
                        <td className="px-6 py-4 font-serif text-mocha-900">{p.name}</td>
                        <td className="px-6 py-4 font-body text-sm text-mocha-500">
                        <span className="bg-cream-200 px-2 py-1 rounded text-xs">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 font-body text-sm text-mocha-800">{p.price}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                        <button 
                            onClick={() => handleEdit(p)}
                            className="text-mocha-500 hover:text-mocha-800 text-xs uppercase tracking-wider font-bold p-2"
                        >
                            Sửa
                        </button>
                        <button 
                            onClick={() => handleDelete(p.id)}
                            className="text-red-400 hover:text-red-600 text-xs uppercase tracking-wider font-bold ml-1 p-2"
                        >
                            Xóa
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
                {products.length === 0 ? (
                    <div className="p-8 text-center text-mocha-400 font-body">
                        Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 divide-y divide-cream-100">
                        {products.map(p => (
                            <div key={p.id} className="p-4 flex gap-4 bg-white hover:bg-cream-50 transition-colors">
                                <div className="w-20 h-24 flex-shrink-0 rounded-md overflow-hidden bg-cream-100 border border-cream-200">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow flex flex-col justify-between min-w-0">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-serif text-lg text-mocha-900 leading-tight truncate pr-2">{p.name}</h4>
                                            <span className="font-body text-sm text-mocha-800 font-semibold">{p.price}</span>
                                        </div>
                                        <span className="inline-block bg-cream-100 text-mocha-500 text-[10px] uppercase tracking-wider px-2 py-1 rounded">
                                            {p.category}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-end gap-3 mt-3">
                                        <button 
                                            onClick={() => handleEdit(p)}
                                            className="px-3 py-1.5 border border-mocha-200 rounded text-xs text-mocha-600 font-medium hover:bg-mocha-50"
                                        >
                                            Sửa
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(p.id)}
                                            className="px-3 py-1.5 border border-red-200 rounded text-xs text-red-400 font-medium hover:bg-red-50"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {products.length === 0 && (
                <div className="hidden md:block p-8 text-center text-mocha-400 font-body">
                    Chưa có sản phẩm nào. Hãy thêm sản phẩm mới.
                </div>
            )}
        </div>
      </SectionWrapper>
    </div>
  );
};