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

import csv
from pathlib import Path
import json
from itertools import chain

thisfile = Path(__file__)
infile = thisfile.parent.parent / 'OHBM 2020 Poster Numbering - AbstractsAdHocReport_2015_20200.tsv'
sdfile = thisfile.parent.parent / 'SoftwareDemos.tsv'
dlfile = thisfile.parent.parent / 'poster_downloads_matches.csv'

urls = dict()
for line in csv.DictReader(dlfile.read_text().splitlines(), quotechar='"', delimiter=','):
    if line['number'] in [None, ''] or '.comet:' in line['url']:
        continue
    urls[int(line['number'])] = line['url']

recs = []
overrides = []
orig_header = ("number", "title", "presenter_first", "presenter_last", "institution", "cat1", "cat2")
for line in chain(
        infile.read_text().splitlines(),
        sdfile.read_text().splitlines(),
    ):
    if not line.strip():
        continue
    try:
        entries = line.split('\t')
        if len(entries) == len(orig_header):
            rec = dict(zip(orig_header, entries))
        elif len(entries) == len(orig_header)+1:
            rec = dict(zip(orig_header + ('pdf',), entries))
        else:
            raise ValueError
        rec['number'] = int(rec['number'])
        rec['presenter'] = '{} {}'.format(rec.pop('presenter_first'), rec.pop('presenter_last'))
        rec['categories'] = '{}<br>{}'.format(rec.pop('cat1'), rec.pop('cat2'))
        url = 'ohbm2020-{number}'.format(**rec)
        rec['videochat'] = f'<a href="https://meet.jit.si/{url}" target="_{url}">jitsi:{url}</a>'
        rec['pdf'] = rec.get('pdf', urls.get(rec['number'], ''))
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
# trim to only what is there identified by numb
overrides = {e['number']: e for e in overrides['posters']}
for orig in recs['posters']:
    override = overrides.get(orig['number'])
    if not override:
        continue
    assert orig['number'] == override['number']
    orig.update(override)

# NOTE:overrides should not be regenerated as is, so we will run ones and comment it out
for struct, filename in ((recs, 'posters.json'),): #, (overrides, 'posters-overrides.json')):
    (thisfile.parent.parent / filename).write_text(
        json.dumps(struct, indent=1))
