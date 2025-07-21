const serve = require('bun').serve;

serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === '/') {
      return new Response(Bun.file('./index.html'));
    }
    
    if (url.pathname.startsWith('/src/')) {
      return new Response(Bun.file('.' + url.pathname));
    }
    
    if (url.pathname.startsWith('/dist/')) {
      return new Response(Bun.file('.' + url.pathname));
    }
    
    // Handle CSS and JS files without /dist prefix
    if (url.pathname === '/styles.css') {
      return new Response(Bun.file('./dist/styles.css'));
    }
    
    if (url.pathname === '/index.js') {
      return new Response(Bun.file('./dist/index.js'));
    }
    
    return new Response('Not found', { status: 404 });
  }
});

console.log('Server running on http://localhost:3000');
