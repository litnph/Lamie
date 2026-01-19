import React, { useState } from 'react';
import { SectionWrapper, Button, LamieLogoIcon, FadeIn } from './ui/Base';

interface LoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // SIMULATED AUTHENTICATION DELAY
    setTimeout(() => {
      // MOCK CREDENTIALS
      if (username === 'admin' && password === 'lamie2024') {
        // Generate a mock token
        const token = 'lamie_token_' + Date.now();
        localStorage.setItem('lamie_auth_token', token);
        onLoginSuccess();
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center pt-20 pb-12 px-4">
      <FadeIn className="w-full max-w-md bg-white p-8 md:p-12 rounded-lg shadow-xl border border-cream-200 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-mocha-100/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

        <div className="flex flex-col items-center mb-8">
          <LamieLogoIcon className="w-16 h-16 text-mocha-800 mb-4" />
          <h2 className="font-serif text-3xl text-mocha-900">Quản Trị Viên</h2>
          <p className="font-body text-mocha-400 text-sm mt-2">Vui lòng xác minh danh tính của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-mocha-300 font-bold">Tên đăng nhập</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-b border-cream-200 py-3 focus:outline-none focus:border-mocha-500 transition-colors bg-transparent font-body text-mocha-800"
              placeholder="Nhập tên đăng nhập"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-mocha-300 font-bold">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-cream-200 py-3 focus:outline-none focus:border-mocha-500 transition-colors bg-transparent font-body text-mocha-800"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs font-body bg-red-50 p-3 rounded border border-red-100 animate-fade-in-up">
              {error}
            </div>
          )}

          <div className="pt-4 flex flex-col gap-4">
            <Button 
              type="submit" 
              className={`w-full justify-center ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </Button>
            
            <button 
              type="button"
              onClick={onCancel}
              className="text-xs uppercase tracking-widest text-mocha-400 hover:text-mocha-800 transition-colors text-center"
            >
              Quay lại Cửa Hàng
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-cream-100 pt-4">
            <p className="text-[10px] text-mocha-300">
                Tài khoản demo: <span className="font-bold">admin</span> / <span className="font-bold">lamie2024</span>
            </p>
        </div>
      </FadeIn>
    </div>
  );
};