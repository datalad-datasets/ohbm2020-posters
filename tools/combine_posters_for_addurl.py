#!/usr/bin/env python3
#emacs: -*- mode: python-mode; py-indent-offset: 4; tab-width: 4; indent-tabs-mode: nil -*-
#ex: set sts=4 ts=4 sw=4 noet:
"""

 COPYRIGHT: Yaroslav Halchenko 2020

 LICENSE: MIT

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
"""

__author__ = 'yoh'
__license__ = 'MIT'

import sys
from pathlib import Path
import json
from itertools import chain

thisfile = Path(__file__)
posters_file = thisfile.parent.parent / 'posters.json'
overrides_file = thisfile.parent.parent / 'posters-overrides.json'
assert overrides_file.exists()  # must be there now
posters = json.loads(posters_file.read_text())
overrides = json.loads(overrides_file.read_text())
# trim to only what is there identified by numb
overrides = {e['number']: e for e in overrides['posters']}
errors = {}
with_pdf = []
def good_url(url):
    return url.split('.')[-1] in ('pdf', 'jpg', 'jpeg', 'png')
def info(msg):
    sys.stderr.write(msg + '\n')
for orig in posters['posters']:
    number = orig.get('number')
    orig_pdf = orig.get('pdf', '')
    override = overrides.get(orig['number'])
    override_pdf = override.get('pdf', '')
    if not override:
        continue
    assert orig['number'] == override['number']
    orig.update(override)
    pdf = orig.get('pdf').strip()
    if not pdf:
        continue
    if not good_url(pdf):
        if good_url(orig_pdf):
            # I saw no hits :-/
            info(f"Taking {orig_pdf} instead of {pdf}")
            pdf = orig_pdf
        else:
            # we will need to skip this ones
            info(f"Skipping {number}: {pdf} since seems not suitable for download")
            continue
    # sanitize obnoxious //
    orig['pdf'] = pdf.replace('//', '/')
    # we also want to sanitize some!
    if 'cdn-akamai.6connex.comet' in pdf:
        errors[orig['number']] = pdf
    elif pdf:
        with_pdf.append(orig)

if errors:
    print("We still have problematic PDF urls:")
    from pprint import pprint
    pprint(errors)
    sys.exit(1)

print(json.dumps(with_pdf, indent=1))
