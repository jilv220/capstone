import { Scenarios } from '@/interfaces/scenario';
import { useState } from 'react';

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenarios>([]);
  return scenarios;
}
