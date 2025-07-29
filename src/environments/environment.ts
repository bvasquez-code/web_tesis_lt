// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'dev',
  urlPortal: 'https://portal.farmaciasperuanas.pe/login',
  urlWSPortal: 'http://dev.projectmanagerws.solucionesfps.pe',
  urlDefault: 'https://portal.farmaciasperuanas.pe/login',
  settings: {
    // backend: "http://localhost:8090",
    backend: 'https://wswatesis-production.up.railway.app',
    // backend : "https://svx2xm5s-8090.brs.devtunnels.ms",
    backend_ia : 'http://localhost:4000'
    // backend_ia : "https://svx2xm5s-4000.brs.devtunnels.ms"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
