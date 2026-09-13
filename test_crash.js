const { JSDOM } = require('jsdom');
JSDOM.fromURL('http://localhost:8080/index.php', {
  runScripts: 'dangerously',
  resources: 'usable',
  beforeParse(window) {
    window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
    // We want to simulate what happens if app.js throws a ReferenceError on load.
    // Instead of overriding eval, let's just add an error listener that we can observe.
  }
}).then(dom => {
  dom.window.addEventListener('error', e => console.error('JS Error:', e.error));
  setTimeout(() => {
    // Manually trigger the crash before click!
    try {
        dom.window.eval('refreshSelects()');
    } catch(e) {
        console.error('Simulated crash:', e.message);
    }
    const btn = dom.window.document.querySelector('.nav-links a[data-page="tours"]');
    btn.click();
    setTimeout(() => {
      console.log('Page tours classes:', dom.window.document.getElementById('page-tours').className);
      process.exit(0);
    }, 500);
  }, 3000);
});
