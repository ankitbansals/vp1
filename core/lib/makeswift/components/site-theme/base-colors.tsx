import { themeToCssVars } from './to-css';

export const colors = {
  primary: '357 95% 45%',  /* #e30613 */
  accent: '357 95% 90%',  /* Lighter red for accents */
  background: '0 0% 100%',
  foreground: '220 27% 16%',  /* Dark gray for text */
  success: '147 90% 38%',
  error: '0 84% 60%',
  warning: '40 100% 50%',
  info: '210 100% 50%',
  contrast: {
    100: '0 0% 96%',
    200: '0 0% 90%',
    300: '0 0% 80%',
    400: '0 0% 60%',
    500: '0 0% 40%',
  },
  primaryMix: {
    white: {
      75: '357 95% 85%',  /* Lighter red */
    },
    black: {
      75: '357 95% 15%',  /* Darker red */
    },
  },
};

export const BaseColors = () => (
  <style data-makeswift="theme-base-colors">{`:root {
      ${themeToCssVars(colors).join('\n')}
    }
  `}</style>
);
