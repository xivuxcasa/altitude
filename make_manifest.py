#!/usr/bin/env python3
"""Write a manifest that loads Altitude from a hosted address instead of localhost.

    python3 make_manifest.py https://xivuxcasa.github.io/altitude

Creates manifest.hosted.xml. Sideload that file in Outlook (Add from file).
manifest.xml stays pointed at https://localhost:3000 for local development.
"""
import re, sys, pathlib

if len(sys.argv) != 2 or not sys.argv[1].startswith('https://'):
    raise SystemExit('Usage: python3 make_manifest.py https://<user>.github.io/<repo>')

base = sys.argv[1].rstrip('/')
here = pathlib.Path(__file__).resolve().parent
xml = (here / 'manifest.xml').read_text()
xml = xml.replace('https://localhost:3000', base)
xml = re.sub(r'<!-- Altitude: .*?-->', f'<!-- Altitude: hosted manifest. Served from {base} -->', xml)
out = here / 'manifest.hosted.xml'
out.write_text(xml)
print(f'Wrote {out.name} for {base}')
