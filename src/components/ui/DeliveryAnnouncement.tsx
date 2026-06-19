import React from 'react';
import { Info } from 'lucide-react';

const DeliveryAnnouncement = () => {
  return (
    <div className="bg-brand-orange text-white py-3 px-4 w-full shadow-sm">
      <div className="container-custom flex items-center justify-center text-center gap-2 text-sm md:text-base font-medium">
        <Info className="h-5 w-5 shrink-0" />
        <p>Please note: All orders will be delivered after July 13th.</p>
      </div>
    </div>
  );
};

export default DeliveryAnnouncement;
