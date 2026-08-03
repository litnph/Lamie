
import React, { useState } from 'react';
import { FadeIn } from '../components/ui/FadeIn';
import { Button } from '../components/common/Button';
import { LamieLogoIcon } from '../components/common/Icons';
import { Card } from '../components/ui/Card';
import { TextField } from '../components/ui/FormControls';

export const Login: React.FC<{ onLoginSuccess: () => void, onCancel: () => void }> = ({ onLoginSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login for any input
    if (email && pass) {
      localStorage.setItem('lamie_token', Date.now().toString());
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-mocha-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cream-200 rounded-full opacity-30 blur-2xl"></div>
      </div>

      <FadeIn className="w-full max-w-md relative z-10">
        <Card surface="raised" padding="lg">
        <div className="flex flex-col items-center mb-10">
          <LamieLogoIcon className="w-16 h-16 text-mocha-800 mb-6" />
          <h2 className="font-serif text-3xl text-mocha-900">Welcome Back</h2>
          <p className="font-body text-mocha-400 mt-2 text-sm">Sign in to view your floral journey</p>
        </div>
        
        <form onSubmit={submit} className="space-y-6">
          <TextField id="login-email" label="Email address" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@example.com" required />
          <div className="space-y-2">
             <div className="flex justify-end">
                <a href="#" className="text-[10px] text-mocha-400 hover:text-mocha-800 italic">Forgot?</a>
             </div>
             <TextField id="login-password" label="Password" type="password" autoComplete="current-password" value={pass} onChange={e => setPass(e.target.value)} required />
          </div>
          
          <div className="flex flex-col gap-4 pt-4">
             <Button className="w-full shadow-lg">Sign In</Button>
             <div className="text-center text-xs text-mocha-400 font-body">
                Don't have an account? <button type="button" className="text-mocha-800 font-bold underline">Register</button>
             </div>
             <button type="button" onClick={onCancel} className="mt-4 text-[10px] uppercase tracking-widest text-mocha-300 hover:text-mocha-800 transition-colors">Return to Shop</button>
          </div>
        </form>
        </Card>
      </FadeIn>
    </div>
  );
};
