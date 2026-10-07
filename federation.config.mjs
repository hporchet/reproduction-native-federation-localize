import {
  fromPackageJson,
  withNativeFederation,
} from '@angular-architects/native-federation/config';

export default withNativeFederation({
  name: 'shell-trad-bug',
  exposes: {
    bootstrap: './src/bootstrap.ts',
  },
  shared: fromPackageJson({
    singleton: true,
    strictVersion: false,
    requiredVersion: 'auto',
  }).get(),
  features: {
    integrityHashes: true,
  },
});