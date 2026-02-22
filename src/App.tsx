import { AppProvider } from './context/AppContext';
import WizardShell from './components/wizard/WizardShell';

export default function App() {
  return (
    <AppProvider>
      <WizardShell />
    </AppProvider>
  );
}
