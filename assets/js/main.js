/* global window XMLHttpRequest */
var metadataDir = './'
var ntCache = {};   // node_path: type cache[dictionary]
/* might need (in)validation, e.g. while testing with local
   localhost:8000  it kept bringing install urls from previous
   sessions... obscure
   Or may be should be replaced with sessionStorage altogether
var stored = sessionStorage['ntCache'];
*/
var stored = localStorage['ntCache'];
if (stored) ntCache = JSON.parse(stored);

/* Markdown converter */
showdown.setOption('simplifiedAutoLink', true);
showdown.setOption('ghCodeBlocks', true);
showdown.setOption('ghCompatibleHeaderId', true);
var converter = new showdown.Converter();

/**
 * check if url exists
 * @param {string} url url to test for existence
 * @return {boolean} returns true if url exists
 */
function urlExists(url) {
  var http = new XMLHttpRequest();
  try {
    // TODO: sync open seems to be deprecated.
    http.open('HEAD', url, false);
    http.send();
  } catch (err) {
    // seems to not work if subdir is not there at all. TODO
    return false;
  }
  return http.status !== 404;
}

/**
 * if path given return path else return window.location.pathname
 * replaces direct calls to window.location with function
 * allows mocking tests for functions using window.location.pathname
 * @return {string} returns path to current window location
 */
function loc() {
  return window.location;
}

/**
 * decompose url to actual path to node
 * e.g if nextUrl = d1/d2/d3, currentUrl = example.com/ds/?dir=d1/d2
 * return example.com/ds/d1/d2/d3
 * @param {string} nextUrl name of GET parameter to extract value from
 * @return {string} returns path to node based on current location
 */
function absoluteUrl(nextUrl) {
  if (!nextUrl)
    return loc().pathname;
  else
    return (loc().pathname.replace(/\?.*/g, '') + nextUrl).replace('//', '/');
}

/**
 * extract GET parameters from URL
 * @param {string} name name of GET parameter to extract value from
 * @param {string} url url to extract parameter from
 * @return {string} returns the value associated with the `name` GET parameter if exists else null
 */
function getParameterByName(name, url) {
// refer https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  if (!url) url = loc().href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results || !results[2]) return null;
  return decodeURIComponent(results[2]); // .replace(/\+/g, " "));
}

/*
Helper to check if cache has the item and the key for it set, get and set them
*/
function has_cached(item, key) {
    return (item in ntCache) && (key in ntCache[item]);
}
function get_cached(item, key) {
    return ntCache[item][key];
}
function set_cached(item, key, value) {
    var cache_rec = (item in ntCache) ? ntCache[item] : {};
    cache_rec[key] = value;
    ntCache[item] = cache_rec;
    return value;
}

/**
 * update url parameter or url ?
 * @param {string} nextUrl next url to traverse to
 * @param {string} type type of clicked node
 * @param {string} currentState current node type. (variable unused)
 * @return {boolean} true if clicked node not root dataset
 */
function updateParamOrPath(nextUrl, type, currentState) {
  // if url = root path(wrt index.html) then append index.html to url
  // allows non-root dataset dirs to have index.html
  // ease constrain on non-datalad index.html presence in dataset
  if (nextUrl === loc().pathname || nextUrl === '/' || !nextUrl)
    return false;
  else if (type === 'file' || type === 'link')
    return false;
  else
    return true;
}

/**
 * wrap and insert error message into html
 * @param {object} jQuery jQuery library object to insert message into DOM
 * @param {object} msg message to wrap and insert into HTML
 */
function errorMsg(jQuery, msg) {
  jQuery('#content').prepend(
    "<P> ERROR: " + msg + "</P>"
  );
}

/**
 * get (and cache) the node type given its path and associated metadata json
 * @param {object} jQuery jQuery library object
 * @param {object} md5 md5 library object
 * @param {string} url leaf url to start caching from upto root
 * @param {object} json metadata json object
 * @return {string} returns the type of the node at path
 */
function getNodeType(jQuery, md5, url) {
  // convert url to cache key [url relative to root dataset]
  var relUrl = getParameterByName('dir', url) || '/';

  function abspathlen(url) {
    return url.replace(loc().search, '').replace(/\/$/, '').length;
  }

  // if outside root dataset boundary, return default node type
  if (abspathlen(loc().href) > abspathlen(url))
    return 'dir';

  // if key of url in current path, return cached node's type
  if (has_cached(relUrl, "type"))
    return ntCache[relUrl].type;

  // else get metadata json of node if no json object explicitly passed
  var temp = nodeJson(jQuery, md5, false, false, url);
  var metaJson = temp.js;
  var dsLoc = temp.ds;

  // return default type if no metaJson or relative_url
  if (!relUrl || !("path" in metaJson) || !("type" in metaJson)) return 'dir';

  // Find relative url of dataset of node at passed url
  // Crude method: Find name of the current dataset in the url passed
  // i.e if dataset_name = b, url = a/b/c, dataset_url = a/b
  // this will fail in case of multiple node's with same name as dataset in current url path
  // method of finding node's dataset url only used while testing (by passing json directly to func)
  if (!dsLoc) {
    // to ensure correct subpath creation, if ds name empty name or undefined
    metaJson.name = (!metaJson.name || metaJson.name === '') ? undefined : metaJson.name;
    var rx = new RegExp(metaJson.name + ".*", "g");
    dsLoc = relUrl.replace(rx, metaJson.name);
  }
  // cache type of all node's associated with node at url's dataset
  if ("nodes" in metaJson) {
    metaJson.nodes.forEach(function(child) {
      var childRelUrl = child.path !== '.' ? (dsLoc + '/' + child.path).replace(/\/\//, '/') : dsLoc;
      childRelUrl = childRelUrl.replace(/\/+$/, "");  // strip trailing /
      if (!(childRelUrl in ntCache))
        set_cached(childRelUrl, "type", child.type);
    });
  }
  if ("type" in metaJson) return metaJson.type;
  return (relUrl in ntCache) ? ntCache[relUrl].type : "dir";
}

/**
 * render the datatable interface based on current node metadata
 * @param {object} jQuery jQuery library object
 * @param {object} md5 md5 library object
 * @return {object} returns the rendered DataTable object
 */
async function directory(jQuery) {

    // Embed the table placeholder
    jQuery('#content').prepend('<table id="directory" class="display"></table>');

    // add HOWTO install
    jQuery('#installation').prepend(
        '<P style="margin-top: 0px;">Centralized registry of Jitsi audio-video conference rooms per each poster or software demo of OHBM 2020.</P>' +
        '<P style="margin-top: 0px;">For every poster there is a dedicated Jitsi room, which would open in a "dedicated" new window/tab.</P>' +
        '<P style="margin-top: 0px;"><b>We turned on paging, please search by poster number, keywords, names, etc.</b></P>' +
        '<P style="margin-top: 0px;">"Online" counts are approximate and count only people attending through this page.</P>' +
        '<P> More info, sources, issues, PRs:  <a href="https://github.com/datalad-datasets/ohbm2020-posters" target="_github">https://github.com/datalad-datasets/ohbm2020-posters</a>.</p>' +
        '<P> <b>Alternative interfaces</b>: <a href="https://brain-web.github.io/ohbm2020/" target="_brain-web">BrainWeb</a> - interactive posters map, <a href="index_beta.html" target="_vue-ui">Vue based interface (beta)</a></a>');

    let table = jQuery('#directory').DataTable({
        //async: true,    // async get json
        paging: true,  // ensure scrolling instead of pages
        lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
        rowId: 'id',
        columns: [
          {data: "number", title: "#", width: "5%"},
          {data: "title", title: "Title", className: "dt-left", width: "42%"},
          {data: "presenter", title: "Presenter", className: "dt-center", width: "15%"},
          {data: "categories", title: "Categories", className: "dt-left", width: "10%"},
          {data: "software-demo", title: "Demo", className: "dt-center", width: "3%"},
          {data: "videochat", title: "Video Chat", className: "dt-left", width: "15%"},
          {data: "people", title: "Online", className: "dt-center", width: "4%"},
          {data: "pdf", title: "PDF", className: "dt-center", width: "5%"},
          {data: "authors", visible: false},
          {data: "keywords", visible: false},
        ],

        columnDefs: [
            {
                targets: 5,//video
                render(data, type, row) {
                    let name = "ohbm2020-"+row.number; //default
                    if(row.videochat) name = row.videochat; //user can override it to another jitsi name
                    if(row.videochat && row.videochat.startsWith("http")) {
                        //or use custom url
                        return `
                            <a href="${row.videochat}" target="room_${row.number}">
                                custom url
                            </a>
                        `;
                    } else {
                        return `
                            <a href="room.html#${row.number}.${name}" target="room_${row.number}">
                                jitsi://${name}
                            </a>
                        `;
                    }
                },
            },
            {
                targets: 6,//people
                render(data, type, row) {
                    return row.people||'';
                },
            },
            {
                targets: 7,//pdf
                render(data, type, row) {
                    if(row.pdf == '') {
                        return '<a href="https://github.com/datalad-datasets/ohbm2020-posters/pulls">[ADD]</a>';
                    } else {
                        return '<a href="' + row.pdf + '" target="_ohbm2020_pdf_' + row.number + '">PDF</a>';
                    }
                },
            }
        ],

    }); //end of DataTable

    //load posters
    let res = await fetch("posters.json");
    let data = await res.json();
    data.posters.forEach(p=>{
        p.id = 'p'+p.number; //cannot be number (or string of number)
        p.people = 0;
        p.videochat = null; //let's ignore this now (override only)
    });

    //load override and apply
    res = await fetch("posters-overrides.json");
    let override = await res.json();
    override.posters.forEach(o=>{
        let p = data.posters.find(p=>p.number == o.number);
        Object.assign(p, o);
    });

    table.rows.add(data.posters);

    wss = new ReconnectingWebSocket("wss://dev1.soichi.us/ohbm2020/");

    //connect to backend
    let needRedraw = true;
    wss.onopen = () => {
        wss.send(JSON.stringify({action: "dump"}));
    }
    wss.onmessage = e => {
        let msg = JSON.parse(e.data);
        if(msg.dump) {
            for(let key in msg.dump) {
                let row = table.row("#p"+key);
                if(row.length == 1) {
                    table.cell(row, 6).data(msg.dump[key]);
                }
            }
            //table.draw(false);
            needRedraw = true;
        }
        if(msg.update) {
            let row = table.row("#p"+msg.update.id);
            table.cell(row, 6).data(msg.update.count);
            needRedraw = true;
        }
    }

    setInterval(()=>{
        if(needRedraw) {
            console.log("redrawing table");
            table.draw(false);
            needRedraw = false;
        }
    }, 1000);

    localStorage['ntCache'] = JSON.stringify(ntCache);
    return table;
}

