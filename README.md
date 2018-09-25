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

## Usage
Whatever is on the `master` branch reflects what is currently in production.

The [snippets](https://github.com/unt-libraries/assets360/tree/master/snippets/) directory contains the HTML code that is in the Admin Console for the 360 products and references some of the assets contained in the repository. 

* [snippets/meta.txt](https://github.com/unt-libraries/assets360/tree/master/snippets/meta.txt) &mdash; Advanced Settings / Head
* [snippets/header.html](https://github.com/unt-libraries/assets360/tree/master/snippets/header.html) &mdash; Branding / Header
* [snippets/footer.html](https://github.com/unt-libraries/assets360/tree/master/snippets/footer.html) &mdash; Branding / Footer

### If You Need to Make Changes...

The thing to keep in mind is that any changes you make to the existing files on `master` in the repository will immediately be reflected in the live site. But, if you need to make changes to the HTML snippets in the Admin Console, the changes don't propagate to the live site until the "data refresh" happens the next morning. There is a "preview" button you can use to preview changes you make to the HTML immediately.

So, if you need to make basic changes to the existing assets, here's the preferred workflow.

1. Create a new branch for development and testing.
2. On the new branch, modify the assets you need to modify. Push to GitHub.
3. Open the 360 Admin Console in the SerialsSolutions client center. Edit the Head, Header, and Footer text contained in the Admin Console where needed to reference the files on your new branch, for testing. You'll have to switch from `github.io` links, which are hardcoded to `master`, to raw git on the new branch.  **DO NOT change the snippet text in the repository.**
4. Use the "Preview" button in the Admin Console to preview the changes. Continue developing on the new branch until it looks like you want it to look.
5. Revert the changes you made to the HTML in the Admin Console so that they match what's in `master`.
6. At this point, merging your development branch with `master` will make your changes live immediately.

If your changes are more involved, where you need to make changes to the HTML in the Admin Console, and merging updated files into `master` immediately would break production before the data refresh happens, here's one possible workflow.

1. Create a new branch for development and testing.
2. On the new branch, create copies of whatever assets you need to modify so that the original version won't change when you merge with master. Add new assets as needed.
3. Modify the HTML snippets in the 360 Admin Console to reference the new versions of your files on your new branch.
4. Preview and develop as needed until you get it working.
5. Merge your new branch with `master`, but don't delete your dev branch yet. (In this case, when you merge, since you didn't modify any of the pre-existing files, your changes don't go live yet.)
6. Go back to the HTML snippets in the 360 Admin Console. Update references to your new files to point to the `github.io` versions of those files, which should be available now since you've merged your new branch into `master`. Preview your changes again to make sure everything is still working.
7. Now open up the [meta.txt](https://github.com/unt-libraries/assets360/tree/master/snippets/meta.txt), [header.html](https://github.com/unt-libraries/assets360/tree/master/snippets/header.html), and [footer.html](https://github.com/unt-libraries/assets360/tree/master/snippets/footer.html) files on your development branch and copy/paste from the Admin Console into whichever snippets you changed.
8. Merge these changes into `master`. (Still keep your dev branch available.)
9. Now you just have to wait a day. When the data refresh happens, your updated HTML snippets in the Admin Console will go live. The live site will now be referencing the new versions of the asset files that you created instead of the versions that were live the previous day.
10. On your development branch, delete the old versions of the asset files that just became obsolete.
11. Merge your change into `master` one last time. Now you can remove your development branch.

