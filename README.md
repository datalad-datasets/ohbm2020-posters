# :door::video_camera: OHBM2020 Posters Jitsi Rooms
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## :question: Motivation
<p align=justify>As much as we had fun preparing our <a href="https://ohbm.6connex.com/event/OHBMAnnualMeeting/en-us#!/CenterforOpenNeuroscience">Center of Open Neuroscience: DataLad, ReproNim, et al.</a> booth, experience with the conference platform quickly showed its shortcomings: poster sessions seemed to be limited to "open a PDF, find the presenter somewhere in an old fashioned chat and 'converse' there". It is not even 2010 -- it is more of 2000. There were discussions about
 establishing some <code>gather.town</code> room for poster presentations etc.</p>  
<p align=justify>Since there is a spreadsheet with all the posters, and unique IDs for each one (but unfortunately without PDF URLs to be added to git-annex/DataLad), we decided to (ab)use Jitsi to provide each poster with a dedicated video room.</p>
 
## :boom: What the Heck Is Jitsi?
<p align=justify>Jitsi is your free and open source Zoom, Google Meet, whatnot... But it is more than that -- it is a decentralized, and IIRC end-to-end encrypted video conferencing system. I believe it is used by the <code>gather.town</code> that many of you got to love. Discover more on <a href="https://en.wikipedia.org/wiki/Jitsi">wikipedia:Jitsi</a>.</p>

## :arrow_forward: Implementation
<p align=justify>This "website" is a crude lobotomization of what the basic DataLad datasets navigator <code>datalad create-sibling --with-ui</code> creates for you; <a href="https://datasets.datalad.org">https://datasets.datalad.org</a> is one of such websites.</p>
<p align=justify>Also, if you check the git history, you will see that we have used <a href="http://handbook.datalad.org/en/latest/basics/101-109-rerun.html">datalad run</a> to annotate how <code>posters.json</code> was produced. So you can use <code>datalad rerun _produce_posters.json</code> (where <code>_produce_posters.json</code> is just a git tag) to regenerate <code>posters.json</code> using either a modified script or the original <code>.tsv</code>.</p> 

## :computer: How to Guideline
### :heavy_check_mark: How to Visit the OHBM2020 Posters Jitsi Rooms? 
Go to our website: [https://datalad-datasets.github.io/ohbm2020-posters/](https://datalad-datasets.github.io/ohbm2020-posters/) & wait for the page to load.
<br><br>
<img src="./img/datalad_OHBM2020Posters_icons.png" width="700"/>
<br><br>
:mag::eyes::door: 
1. **Searching for a Poster**: Enter your desired keywords (Number ID, Title, Presenter, Category/ies) in the `Search` box, click on `Enter`, and the table will be limited to the results of your search. 
2. **Viewing a Poster PDF**: Click on the `PDF` associated with the poster you would like to "present" or "attend". Each specific poster PDF would open in a new "dedicated" tab or window. Clicking on it again would just lead you to that tab/window if it was already open.
3. **Visiting a Poster Jitsi Room**: Click on the `jitsi:` associated with the poster you would like to "present" or "attend". Again, each specific poster Jitsi room would open in a new "dedicated" tab or window. Clicking on it again would just lead you to that tab/window if it was already open. Presenters can share their poster window by clicking on the `Share your screen` button in the bottom-left corner of the Jitsi room.

*Remark*: Unfortunately, the "source" spreadsheet neither had presentation dates/times, nor URLs to PDFs. So we might improve upon that (send a PR if you see how).

### :heavy_check_mark: How to Do a Pull Request? Adding Your Poster's Info to the Table

1. **GitHub account**: Create a [GitHub account](https://github.com) if you don’t already have one. As a student, you can apply for the [GitHub Student Developer Pack](https://help.github.com/en/github/teaching-and-learning-with-github-education/applying-for-a-student-developer-pack), which includes offers and benefits from GitHub partners.
2. **Forking**: Fork https://github.com/datalad-datasets/ohbm2020-posters to create a copy of the repository on your own GitHub account.
   * Click on `Fork` in the top-right corner of the page and choose to Fork a copy of the repository on your own GitHub account.
   * You will automatically go to that Fork.<br>
     <img src="./img/datalad_OHBM2020Posters_icons_2.png" width="700"/>
3. **Branching**: Within your Fork, create a Branch to add your poster's info to the table.
   * Click on `Branch: gh-pages` in the semi-top-left corner of the page and write the name of your new Branch (e.g. `poster1929`) in the white rectangle under `Switch branches/tags`. Click on `Enter`.    
   * You will automatically go to that Branch.<br>
     <img src="./img/datalad_OHBM2020Posters_4b.png" width="250"/>
4. **Editing**: Within your Branch, go to the `posters-overrides.json` file & click on the pencil :pencil2: in the top-right corner of the file to edit/add your poster's info (`Video Chat` and `PDF`) to the table.
   * Search for your poster's number (e.g. `"number": 1929`).
   * Put a comma after your poster's number (e.g. `"number": 1929,`).
   * Copy those lines starting with `"videochat"` and `"pdf"` and paste them under your number, e.g. `"number": 1929,`. Do not forget to change `JITSI_ROOM_NAME` and `POSTER_PDF_URL` to 1) the name of your own Jitsi room and 2) the URL to your own poster.<br><br>   
     ```json
     {
      "number": 1929,
      "videochat": "<a href=\"https://meet.jit.si/JITSI_ROOM_NAME\" target=\"JITSI_ROOM_NAME\">jitsi:JITSI_ROOM_NAME</a>",
      "pdf": "POSTER_PDF_URL"
     }
      ```
5. **Committing**: Commit your changes by clicking on the green `Commit changes` button. Do not forget to add a comment, e.g. `add videochat and pdf to poster 1929`.<br><br>
   <img src="./img/datalad_OHBM2020Posters_6b.png" width="700"/>
6. **PR**: Create a pull request (PR).
   * Within your Branch, click on the green `Compare & pull request` button.
   * You will be redirected to the main repository to confirm your PR. Check the remarks displayed in the `Write` section to make sure you haven't forgotten anything.
     Then, click on the green `Create pull request` button.<br><br>
     <img src="./img/datalad_OHBM2020Posters_8b.png" width="700"/>

## ✨ Contributors

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

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
