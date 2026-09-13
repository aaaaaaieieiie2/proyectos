
const { JSDOM } = require('jsdom');
JSDOM.fromURL('http://localhost:8080/index.php', {
  runScripts: 'dangerously',
  resources: 'usable',
  beforeParse(window) {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}).then(dom => {
  dom.window.addEventListener('error', (event) => {
    console.error('JS Error:', event.error ? event.error.stack : event.message);
  });
  setTimeout(() => process.exit(0), 4000);
}).catch(console.error);
