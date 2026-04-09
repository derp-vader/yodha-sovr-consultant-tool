/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppStore } from './store';
import { Onboarding } from './components/Onboarding';
import { Questionnaire } from './components/Questionnaire';
import { Analyzing } from './components/Analyzing';
import { Results } from './components/Results';
import { useEffect } from 'react';

function App() {
  const { step } = useAppStore();

  // Add dark mode class to html based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const newColorScheme = event.matches ? "dark" : "light";
      if (newColorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  return (
    <div className="font-sans text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {step === 'onboarding' && <Onboarding />}
      {step === 'questionnaire' && <Questionnaire />}
      {step === 'analyzing' && <Analyzing />}
      {step === 'results' && <Results />}
    </div>
  );
}

export default App;
