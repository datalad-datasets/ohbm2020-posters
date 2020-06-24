<!--

Thanks for updating your poster entry! Here are some guidelines to ensure your PR can be
merged quickly.

Your PR should only touch the lines in the entry in posters-overrides.json describing your
own poster. For example, if your poster is #1895, then your diff might look like

----

diff --git a/posters-overrides.json b/posters-overrides.json
index 705a583..41f47dd 100644
--- a/posters-overrides.json
+++ b/posters-overrides.json
@@ -5364,7 +5364,9 @@
    "number": 1894
   },
   {
-   "number": 1895
+   "number": 1895,
+   "videochat": "<a href=\"https://meet.jit.si/bids-derivatives\" target=\"_bids-derivatives\">jitsi:bids-derivatives</a>",
+   "pdf": "https://cdn-akamai.6connex.com/645/1827/poster_15922429379118925.pdf"
   },
   {
    "number": 1896

----

Any field besides "number" can be overridden from posters.json, including:

* `"title"`: String
* `"institution"`: String
* `"presenter"`: String
* `"categories"`: String
* `"videochat"`: String (use literal `<a href="..."></a>` to
* `"pdf"`:  URL

Note that you must use standard double-quotes for values. Consider passing your JSON through
a validator (https://duckduckgo.com/?q=json+validator) before submitting.

-->
