# OHBM2020 posters Jitsi rooms
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Just go to https://datalad-datasets.github.io/ohbm2020-posters/ . Wait for the page to load.
Search for a poster by entering desired words present in the title name or presenter name or keywords and table will
limit to the results of the search.  Click on the poster you would like to "present" or "attend", and get into a
dedicated jitsi room.

Unfortunately "source" spreadsheet neither had presentation dates/times, nor URLs to PDFs.  So we might improve upon
that (send a PR if you see how).

## Motivation

As much as we had fun preparing our [Center of Open Neuroscience: DataLad, ReproNim, et al](https://ohbm.6connex.com/event/OHBMAnnualMeeting/en-us#!/CenterforOpenNeuroscience) booth, experience with the conference platform quickly
showed its shortcomings: poster sessions seems will be limited to "open PDF, find presenter somewhere in an old
fashion chat and 'converse' there". It is not even 2010 -- it is more of 2000.  There were discussions about
establishing some gather.town room for poster presentations etc.  

Since there is a spreadsheet with all the posters, and unique IDs for each one (but unfortunately without PDF URLs
to be added to git-annex/DataLad), we decided to (ab)use Jitsi to provide each poster a dedicated video
 room.
 
## What the heck is Jitsi?

Jitsi is your free and open source Zoom, Google Meet, whatnot.  But it is more than that -- it is decentralized, and
IIRC end-to-end encrypted video conferencing system.  I believe it is used by gather.town many of you got to love.
Discover more on [wikipedia:Jitsi](https://en.wikipedia.org/wiki/Jitsi).

## Presenters

You can share your poster window.  Jitsi requires browser extension to provide ability to share your desktop. We
have been use Jitsi happily Chrome/Chromium for years. [Extension link](https://chrome.google.com/webstore/detail/jitsi-meetings/kglhbbefdnlheedjiejgomgmfplipfeb?hl=en-US).

## Visitors

Each poster would open in a new "dedicated" tab or window. Clicking on it again would just lead you to that tab
/window if it was already open.

## Implementation

This "website" is a crude lobotomization of the basic DataLad datasets navigator 
`datalad create-sibling --with-ui` creates for you. https://datasets.datalad.org is one
of such websites.

Also, if you check git history, you will see that we had used [datalad run](http://handbook.datalad.org/en/latest/basics/101-109-rerun.html) to annotate how `posters.json` was produced.
So you can use `datalad rerun _produce_posters.json` (where `_produce_posters.json` is just a git tag) to regenerate `posters.json` happen you either modified script or original `.tsv`. 


## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/christian-monch"><img src="https://avatars3.githubusercontent.com/u/17925232?v=4" width="100px;" alt=""/><br /><sub><b>Christian Mönch</b></sub></a><br /><a href="https://github.com/datalad-datasets/ohbm2020-posters/commits?author=christian-monch" title="Code">💻</a> <a href="#maintenance-christian-monch" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://www.onerussian.com"><img src="https://avatars3.githubusercontent.com/u/39889?v=4" width="100px;" alt=""/><br /><sub><b>Yaroslav Halchenko</b></sub></a><br /><a href="https://github.com/datalad-datasets/ohbm2020-posters/commits?author=yarikoptic" title="Code">💻</a> <a href="#infra-yarikoptic" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-yarikoptic" title="Maintenance">🚧</a> <a href="#ideas-yarikoptic" title="Ideas, Planning, & Feedback">🤔</a> <a href="#design-yarikoptic" title="Design">🎨</a> <a href="#projectManagement-yarikoptic" title="Project Management">📆</a> <a href="#talk-yarikoptic" title="Talks">📢</a></td>
    <td align="center"><a href="http://www.nisox.org"><img src="https://avatars3.githubusercontent.com/u/5155907?v=4" width="100px;" alt=""/><br /><sub><b>Thomas Nichols</b></sub></a><br /><a href="https://github.com/datalad-datasets/ohbm2020-posters/commits?author=nicholst" title="Code">💻</a> <a href="#ideas-nicholst" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/effigies"><img src="https://avatars0.githubusercontent.com/u/83442?v=4" width="100px;" alt=""/><br /><sub><b>Chris Markiewicz</b></sub></a><br /><a href="https://github.com/datalad-datasets/ohbm2020-posters/commits?author=effigies" title="Code">💻</a> <a href="#ideas-effigies" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://rossmarkello.com"><img src="https://avatars0.githubusercontent.com/u/14265705?v=4" width="100px;" alt=""/><br /><sub><b>Ross Markello</b></sub></a><br /><a href="https://github.com/datalad-datasets/ohbm2020-posters/commits?author=rmarkello" title="Code">💻</a> <a href="#ideas-rmarkello" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://www.adina-wagner.com"><img src="https://avatars1.githubusercontent.com/u/29738718?v=4" width="100px;" alt=""/><br /><sub><b>Adina Wagner</b></sub></a><br /><a href="#maintenance-adswa" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!