import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    setupNodeEvents(on) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    experimentalRunAllSpecs: true,
    defaultCommandTimeout: 10000,
    baseUrl: 'https://www.demoblaze.com',
  },
});
