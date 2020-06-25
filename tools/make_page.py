#!/usr/bin/env python3
#emacs: -*- mode: python-mode; py-indent-offset: 4; tab-width: 4; indent-tabs-mode: nil -*-
#ex: set sts=4 ts=4 sw=4 noet:
"""

 COPYRIGHT: Yaroslav Halchenko 2014

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

from pathlib import Path
import json

thisfile = Path(__file__)
infile = thisfile.parent.parent / 'OHBM 2020 Poster Numbering - AbstractsAdHocReport_2015_20200.tsv'

recs = []
overrides = []
for line in infile.read_text().splitlines():
    if not line.strip():
        continue
    try:
        rec = dict(zip(
            ("number", "title", "presenter_first", "presenter_last", "institution", "cat1", "cat2"),
            line.split('\t')))
        rec['number'] = int(rec['number'])
        rec['presenter'] = '{} {}'.format(rec.pop('presenter_first'), rec.pop('presenter_last'))
        rec['categories'] = '{}<br>{}'.format(rec.pop('cat1'), rec.pop('cat2'))
        url = 'ohbm2020-{number}'.format(**rec)
        rec['videochat'] = f'<a href="https://meet.jit.si/{url}" target="_{url}">jitsi:{url}</a>'
        rec['pdf'] = ''
        recs.append(rec)
        overrides.append({'number': rec['number']})
    except ValueError:
        print(f"skip: {line}")
assert len(recs) > 2000
print("Read {} records".format(len(recs)))

recs = {'posters': recs}
overrides = {'posters': overrides}

overrides_file = thisfile.parent.parent / 'posters-overrides.json'
assert overrides_file.exists()  # must be there now
overrides = json.loads(overrides_file.read_text())
for orig, override in zip(recs['posters'], overrides['posters']):
    assert orig['number'] == override['number']
    orig.update(override)

# NOTE:overrides should not be regenerated as is, so we will run ones and comment it out
for struct, filename in ((recs, 'posters.json'),): #, (overrides, 'posters-overrides.json')):
    Path.write_text(thisfile.parent.parent / filename,
        json.dumps(struct, indent=1, ensure_ascii=False))
