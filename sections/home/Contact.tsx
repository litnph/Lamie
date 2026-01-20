
import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Button } from '../../components/common/Button';

export const Contact: React.FC = () => (
  <SectionWrapper id="contact" className="bg-cream-100 py-32">
    <div className="max-w-2xl mx-auto bg-white p-12 md:p-16 rounded shadow-sm border border-cream-200">
      <h2 className="font-serif text-4xl text-center mb-12">Send a Message</h2>
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <input placeholder="Full Name" className="w-full border-b border-cream-200 py-2 focus:outline-none focus:border-mocha-500 font-body bg-transparent" />
           <input placeholder="Phone Number" className="w-full border-b border-cream-200 py-2 focus:outline-none focus:border-mocha-500 font-body bg-transparent" />
        </div>
        <textarea placeholder="How can Lamie help you today?" rows={4} className="w-full border-b border-cream-200 py-2 focus:outline-none focus:border-mocha-500 font-body resize-none bg-transparent" />
        <div className="text-center pt-8">
           <Button className="w-full md:w-auto">Send Message</Button>
        </div>
      </form>
    </div>
  </SectionWrapper>
);
