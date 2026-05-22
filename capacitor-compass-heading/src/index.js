import { registerPlugin } from '@capacitor/core';

const CompassHeading = registerPlugin('CompassHeading', {
  web: () => ({
    start:       async () => { throw new Error('CompassHeading is iOS-only'); },
    stop:        async () => {},
    isAvailable: async () => ({ available: false }),
    addListener: () => ({ remove: async () => {} }),
  }),
});

export { CompassHeading };
export default CompassHeading;
