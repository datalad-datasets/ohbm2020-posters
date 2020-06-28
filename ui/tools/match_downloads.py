#!/usr/bin/env python3

import difflib
from pathlib import Path
import pandas as pd  # because I'm lazy

DPATH = Path(__file__).absolute().parent.parent


def get_id(title, data):
    """
    Parameters
    ----------
    title : str
        Title for which to get poster ID
    data : pandas.DataFrame
        DataFrame with at least columns ['title', 'number']

    Returns
    -------
    number : int
        Poster ID
    """
    row = data.query(f'title == "{title}"')
    if len(row) != 1:
        raise ValueError(f'Zero or no matches for {title} in provided data')
    return row.iloc[0]['number']


if __name__ == "__main__":
    downloads = pd.read_csv(DPATH / 'poster_downloads.csv')
    originals = pd.read_csv(
        DPATH / 'OHBM 2020 Poster Numbering - AbstractsAdHocReport_2015_20200.tsv',
        usecols=['Virtual Poster No', 'Abstract Title', 'Parent Category'],
        delimiter='\t'
    ).set_axis(['number', 'title', 'category'], axis=1, inplace=False)
    known = set(originals['title'])

    matches = []
    # this is slow but we're only doing it once so /shrug
    for idx, (url, title, category) in downloads.iterrows():
        if title in known:  # exact check; much quicker than difflib
            matches.append([title, title, get_id(title, originals)])
            known.remove(title)  # make our future queries a teeny bit faster
            continue
        try:  # any difflib hits?
            suggestions = difflib.get_close_matches(title, known)
            match = suggestions[0]
            matches.append([title, match, get_id(match, originals)])
        except IndexError:  # just keep the title with some blanks
            matches.append([title, '', ''])

    cols = ['title', 'abstract_title', 'number']
    matches = pd.DataFrame(matches, columns=cols).drop_duplicates('title')
    merged = pd.merge(downloads, matches, on='title').dropna(subset=['number'])
    # overwrite input CSV for easier data handling in future
    merged.to_csv('poster_downloads_matches.csv', index=False)
