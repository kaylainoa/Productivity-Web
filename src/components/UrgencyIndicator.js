// src/components/UrgencyIndicator.js
import React from 'react';
import { Flag, AlertTriangle } from 'lucide-react';

function UrgencyIndicator({ urgency }) {
  switch(urgency) {
    case 1:
      return <Flag className="urgency-indicator urgency-important" size={16} />;
    case 2:
      return <AlertTriangle className="urgency-indicator urgency-urgent" size={16} />;
    default:
      return null;
  }
}

export default UrgencyIndicator;