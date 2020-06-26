#!/usr/bin/env python3

from collections import Counter
import json
import re
from string import punctuation as PUNCTUATION

from bs4 import BeautifulSoup
import requests


def check_figure_caption_end(node):
    bad_class = ['abstractcaption', 'priorityOrderHint', 'clear']
    return (node.next.name != 'a'
            and node.attrs.get('class', [''])[0] not in bad_class)


def loop_until_end(text, start, end, sep=''):
    # we passed the "end" h4 marker; abort abort
    if start is None or start.find_next('h4') != end:
        return text.strip(sep)
    # don't include figures or figure captions; we just want text
    if check_figure_caption_end(start):
        text += start.text.strip() + sep
    # recurse, baby
    return loop_until_end(text, start.find_next('div'), end, sep=sep)


# get list of all abstract IDs (these are NOT poster IDs; they're for internal
# use in the OHBM abstract system)
# we'll save a list of the actual poster IDs and the relevant URL that links to
# the abstract
abstract_no = re.compile(r'\((\d+)\)')
url = "https://ww4.aievolution.com/hbm2001/index.cfm?do=abs.pubSearchAbstracts"
abslist = requests.get(url)
abslist.raise_for_status()
content = BeautifulSoup(abslist.content, 'lxml')
abstracts = []
url = "https://ww4.aievolution.com/hbm2001/index.cfm?do=abs.viewAbs&abs={}"
for abno in content.find_all('td', attrs={'class': 'abstractnumber'}):
    href = abno.find_next('a')
    match = abstract_no.search(href.get('href', ''))
    if match:
        abstracts.append({
            'number': int(abno.text),
            'url': url.format(match.group(1))
        })

# go through each poster, fetch the abstract, and parse it. store some
# relevant info and discard the rest
relevant = ['Introduction:', 'Methods:', 'Results:', 'Conclusions:']
bag_of_words = Counter()
for n, abstr in enumerate(abstracts):
    if n % 10 == 0:
        print(n)
    # let's not re-run this for things we've already run (if you're messing
    # around interactively)
    if abstr.get('abstract') is not None:
        continue

    # get the abstract webpage
    resp = requests.get(abstr['url'])
    resp.raise_for_status()
    page = BeautifulSoup(resp.content, 'lxml')

    # get the abstract body and other relevant info
    body = set()
    for h4 in page.find_all('h4'):
        # if we found part of the abstract (intro/methods/results/conclusions)
        if any(r == h4.text.strip() for r in relevant):
            # grab the body of this section
            text = loop_until_end('', h4.find_next('div'), h4.find_next('h4'))
            # strip punctuation and don't include numbers and add to word bag
            body.update([
                f.strip(PUNCTUATION).lower() for f in text.split(' ')
                if re.sub(r'\d+', '', f).strip(PUNCTUATION).lower() != ''
            ])
        # if we found the authors, make a nice list of their names and
        # get rid of the pesky affiliation numbering
        elif h4.text.strip() == 'Authors:':
            authors = h4.find_next('div').text.strip()
            authors = re.sub(r',+(\s)*', ',', re.sub(r'\d', '', authors))
            # don't accidentally drop the last author...
            authors = [f for f in authors.split(',') if f != '']
            abstr['authors'] = authors
        # if we found keywords, make a nice list of them
        # we're lowercasing them because random ones are uppercased but we
        # can make them real ("mri" --> "MRI") later if we want for a select
        # group of keywords
        elif h4.text.strip() == 'Keywords:':
            kws = loop_until_end('', h4.find_next('div'), h4.find_next('h4'),
                                 sep=',')
            abstr['keywords'] = [f.lower() for f in kws.split(',')]
    # save abstract body and add this to our global bag of words
    abstr['abstract'] = body
    bag_of_words.update(body)

# drop words occurring in more than 25% of abstracts; we want unique words!
too_common = {k for k, v in bag_of_words.items() if v > 0.25 * len(abstracts)}
for abstr in abstracts:
    abstr['abstract'] = list(abstr['abstract'].difference(too_common))

# dump to json
with open('abstract.json', 'w') as dest:
    json.dump(abstracts, dest, indent=1, ensure_ascii=False)
