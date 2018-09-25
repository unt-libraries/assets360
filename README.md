# assets360
This contains assets used in customizations of our SerialsSolutions 360 products: CSS, JS, and image files. It's mainly used to provide reliable hosting outside of the UNT network for these assets in order to let us work around an issue with accessing the 360 services from an MS Edge browser in Windows 10 on campus.

## 360 Services
The services in question are the ones that provide access to our e-journals&mdash;the e-journal portal and link resolver.  (https://dq4wu5nl3d.search.serialssolutions.com/)

## Issue Summary
Essentially the problem boils down to the fact that the 360 services are vendor-hosted, yet we've customized them so that they call CSS/JS/images on local `unt.edu` servers. Edge has a security "feature" where, if you're accessing a site on the same subdomain as your computer, it automatically considers that site to be part of your intranet zone, and it doesn't permit a site outside that zone to call resources and assets in that zone. It blocks those requests and issues an SEC7117 error. This issue only affects Edge running on Windows 10 machines on campus. Off campus, the requests are allowed to go through because the main site and assets are all part of the public Internet zone relative to that computer.

More information:
* https://stackoverflow.com/questions/32602343/microsoft-edge-browser-error-sec7117
* https://stackoverflow.com/questions/32384571/why-does-microsoft-edge-open-some-local-websites-but-not-others-where-the-doma/32828629#32828629
* https://stackoverflow.com/questions/31860020/sec7117-error-when-trying-to-load-a-javascript-file-in-ms-edge


## Workaround
Since we can't&mdash;and shouldn't&mdash;change the network to put our externally hosted sites into the intranet zone, the only reliable workaround is to host all asset files on a server that is external to the UNT network. Hosting them on GitHub, under our unt-libraries organization account, and providing access via GitHub pages seems like a good solution, for now. It also forces us to have these customizations in git (where they weren't, previously).