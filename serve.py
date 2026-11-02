#!/usr/bin/env python3
"""Serve the Altitude add-in over HTTPS on https://localhost:3000.

Outlook only loads add-ins from HTTPS. By default this uses the certificate
created by `npx office-addin-dev-certs install`; pass --cert/--key to use another
trusted localhost certificate (for example one made with mkcert).
"""
import argparse, http.server, os, ssl, functools

home = os.path.expanduser('~/.office-addin-dev-certs')
ap = argparse.ArgumentParser()
ap.add_argument('--port', type=int, default=3000)
ap.add_argument('--cert', default=os.path.join(home, 'localhost.crt'))
ap.add_argument('--key', default=os.path.join(home, 'localhost.key'))
args = ap.parse_args()

for f in (args.cert, args.key):
    if not os.path.exists(f):
        raise SystemExit(f'Certificate file not found: {f}\nRun `npx office-addin-dev-certs install` first, or pass --cert and --key.')

root = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

httpd = http.server.ThreadingHTTPServer(('localhost', args.port), functools.partial(Handler, directory=root))
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain(args.cert, args.key)
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
print(f'Altitude add-in served at https://localhost:{args.port}/taskpane.html  (Ctrl+C to stop)')
httpd.serve_forever()
