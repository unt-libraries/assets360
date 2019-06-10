# assets360

* [About](#about)
* [UNT Usage and Workflows](#unt-usage-and-workflows)
  * [Usage Environment](#usage-environment)
  * [Workflows](#workflows)
    * [Starting a New Set of Edits](#starting-a-new-set-of-edits)
    * [Finishing and Prepping Edits for Deployment](#finishing-and-prepping-edits-for-deployment)
    * [End of the Day, Edits are NOT Complete](#end-of-the-day-edits-are-not-complete)
  * [Development Tips](#development-tips)
    * [How to Preview 360 Link](#how-to-preview-360-link)
* [Details about Hosted Assets and MS-Edge](#details-about-hosted-assets-and-ms-edge)


## About
  
This repository contains assets used in customizations of our two public-facing SerialsSolutions 360 products: the **E-journal Portal**, which provides access to our ejournals, and **360 Link**, our link resolver. (https://dq4wu5nl3d.search.serialssolutions.com/)

This README documents the overall environment and workflows for making changes to our 360 services.

[Top](#top)


## UNT Usage and Workflows

The 360 services are vendor-hosted and are therefore unusual in terms of how they are customized and how customizations are deployed. Several factors inform the [usage environment](#usage-environment), discussed below. If you just want to see the workflows, then you can [skip to that section](#workflows).


### Usage Environment

* There are two 360 services that we maintain, the **E-journal Portal** and the **360-link link resolver**. From an end-user POV, they are part of the same system, so we use the exact same assets for both services and treat them as one thing.

* These services are **vendor-hosted**. We customize them by adding and maintaining our own HTML snippets through an admin console that the vendor provides. For each of the two services, there is a separately customizable **header**, **footer**, and **head html** section. The header and footer both display whatever HTML you enter before and after the vendor's HTML. Whatever you put in the head-html section is placed inside the HTML `<head>` tag.

* Within the vendor-system environment, we have the ability to make changes to the HTML snippets and preview them immediately without affecting the live site. Changes are deployed the following morning at 8:30, automatically. As far as I know there is no way to deploy them early or postpone deployment. If a changeset will take longer than a day, the HTML snippets need to be reverted back to the live version before the end of the day.

* Any of our custom HTML snippets can reference other Web assets: images and CSS styles for UNT branding; Bootstrap hosted on an external CDN; and our own CSS and JavaScript files.

* Users access the public interface for our 360 services on a non-UNT domain. Due to a security feature in MS Edge, **we cannot host any of our custom assets on a UNT server**&mdash;Edge ends up blocking our assets accessed from on-campus computers. [See more information about this issue here.](#details-about-hosted-assets-and-ms-edge) We cannot host files on the vendor's site, either.

* So we've chosen to host our local assets directly via GitHub, using free CDN services that enable you to serve raw files over GitHub. Specifically, these include:

  * [raw.githack.com](https://raw.githack.com)
  * [GitCDN](https://gitcdn.xyz/)
  * GitHub pages for this repository, served via the `gh-pages` branch.

  Raw.githack and GitCDN allow you to reference different versions of files in a GitHub repository via specific tags or specific commit hashes, and they have very long-term caching. These are good for providing production-level links to specific tagged versions of assets, which works well given how production deployment of our 360 services works.
  
  GitHub Pages is best for development, because they are updated immediately after pushing to the source branch (i.e. `gh-pages`). Raw.githack does offer development versions of links as well, but these are still cached and often take ~10 minutes to update, while GH Pages is nearly instantaneous.

[Top](#top)


### Workflows

Before getting started, clone this repository to a local working directory if you haven't already.

```git clone https://github.com/unt-libraries/assets360.git assets360```


#### Starting a New Set of Edits

1. Check out the `gh-pages` branch. This will be the branch you use for development, because it deploys automatically to GH Pages.

2. Open the `footer.html`, `header.html`, and `meta.txt` files from the `snippets` directory. These _should_ match whatever is currently in the admin console in the Client Center.

3. In all three files, you need to switch references pointing to the current live tagged version of each asset (being served by a CDN) over to the GH Pages version. E.g., if the current live version is v2.0.0, do a global find/replace in your text editor: find `https://gitcdn.xyz/repo/unt-libraries/assets360/v2.0.0/` and replace it with `https://unt-libraries.github.io/assets360/`.

4. Log into the Admin Console on the SerialsSolutions Client Center site and open the 360 Core E-journal Portal administration console (version 1).

5. In the **branding options** section, update the **Header** and **Footer** sections. Click the "Edit" button in the upper right to make these fields editable. Copy the text from your open version of `header.txt` into **Header** and `footer.txt` into **Footer**. Click "Save."

6. In the **advanced options** section, find the **Head HTML** text field. Click the "Edit" button, and then copy from your open version of `meta.txt` and paste into the form field. Click "Save."

7. Click the "Preview" button to open a preview of your changes. Double check to make sure it looks correct and is now referencing files on GH Pages. At this point nothing should have visibly changed except where the asset files it's referencing are.

8. Now you can work on changes as needed, using the `gh-pages` branch. Change/edit files, delete files, and add new files. The changes should be reflected immediately on GH Pages, and thus on the preview site. Add/remove references to files in the HTML snippets and update in the admin console as needed. Whenever you update code in the admin console you have to refresh the preview by hitting the Preview button again.


#### Finishing and Prepping Edits for Deployment

1. Decide what this new version will be. E.g., if the old version was v2.0.0, maybe this is v2.0.1.

2. In the `footer.html`, `header.html`, and `meta.txt` files from the `snippets` directory, do another series of global find/replace commands to replace the GH Pages URL with the CDN URL. E.g., replace `https://unt-libraries.github.io/assets360/` with `https://gitcdn.xyz/repo/unt-libraries/assets360/v2.0.1/`.

3. Save these and push them to GH. (Still on the `gh-pages` branch.)

4. In the SerialsSolutions Client Center site, copy and paste from each of the above files into the relevant Header, Footer, and Head HTML sections. **Be sure to do this both for the E-journal Portal _and_ 360 Link.**

5. In git, create a new tag for the new version. E.g., if the new version is v2.0.1:

        git tag -a v2.0.1 -m "This version contains ..."
        git push origin --tags

6. Preview the changes one more time. Make sure all your assets are being loaded from the CDN using the right version.

7. If you find mistakes while doing a final preview and need to make changes to the assets, you'll want to create and tag a new version, repeating steps 1-6. You _can_ delete the old tag and re-tag using the same version, but the CDN will have already permanently cached that tag. Changing the version is easier.

8. If everything looks good, then the last step is to merge your changes from `gh-pages` into `master`.

        git checkout master
        git merge gh-pages

9. And, you're done. At around 8:30 AM the next morning, your changes should be reflected on the live site.


#### End of the Day, Edits are NOT Complete

If your changes won't be finished before the end of the day, then you need to make sure all of the HTML snippets are reverted back to their previous state before you leave so that your changes don't go live.

1. Make sure all of the changes you've made are saved to the repository and pushed to GH.

2. Open up the `footer.html`, `header.html`, and `meta.txt` files from the `snippets` directory of whatever release version is currently live.

3. In the SerialsSolutions Client Center site, copy and paste from each of the above files into the relevant Header, Footer, and Head HTML sections. **Be sure to do this both for the E-journal Portal _and_ 360 Link.**

4. Add an HTML comment at the top of one of the Header or Head HTML sections. The next morning around 8:30 or 9:00 you can check the live site to see if your comment appears so you know the data refresh is done and you can resume working.

5. The next day, **after the data refresh has happened**, open the dev version of each of the three `footer.html`, `header.html`, and `meta.txt` snippets, copy and paste them back into the admin console fields, and get back to work.

[Top](#top)


### Development Tips

* Don't forget to check the preview in MS Edge! If you're just using Chrome or Firefox for development it can be easy to miss files that are still being loaded from the main library website.

* Don't forget that the E-journal Portal _and_ 360 Link both need to be updated and checked.

* Pressing the Preview button in one section of the admin console only regenerates the preview for that one service but not the other. After you update each you have to press the Preview button for each.

* Wait&mdash;when you click "Preview" in 360 Link, it takes you to a journal page that automatically redirects to the publisher's site. You can't actually view the link resolver page that way. When you're in the E-journal Portal, clicking the link to view "More full text options" normally takes you straight to the link resolver page, but doing so in the preview site still takes you to the live site. So how do you actually preview changes to 360 Link? Read on ...


#### How to Preview 360 Link

1. If you've updated the header, footer, or head HTML sections of 360 Link in the admin console, then you must click the "Preview" button after saving them in order to regenerate the 360 Link preview. Don't skip this step, even though it will take you to an external journal site.

2. Open the E-journal Portal preview site. Search or browse for an e-journal.

3. Copy the below portion of the URL in your browser. (Or just copy it from here.)

        http://ae.preview.serialssolutions.com/?L=DQ4WU5NL3D&

4. Click "More full text options" for any of the journals. This takes you to a 360 Link page for the live site.

5. In your browser's address bar, highlight this part of the URL: `http://dq4wu5nl3d.search.serialssolutions.com/?`. Paste the above text in its place and hit enter load the new URL. This takes you to the preview version of that page.

[Top](#top)


## Details about Hosted Assets and MS-Edge

MS Edge has a security feature where, if you're accessing a site on the same subdomain as your computer, it automatically considers that site to be part of your intranet zone, and it doesn't permit a site outside that zone to call resources and assets in that zone. It blocks those requests and issues an SEC7117 error. This issue only affects Edge running on Windows 10 machines on campus. Off campus, the requests are allowed to go through because the main site and assets are all part of the public Internet zone relative to that computer.

Since we can't&mdash;and shouldn't&mdash;change the network to put our externally hosted sites into the intranet zone, the only reliable workaround is to host all asset files on a server that is external to the UNT network. Hosting them on GitHub, under our unt-libraries organization account, and providing access via external CDNs seems like a good solution, for now.

More information:
* https://stackoverflow.com/questions/32602343/microsoft-edge-browser-error-sec7117
* https://stackoverflow.com/questions/32384571/why-does-microsoft-edge-open-some-local-websites-but-not-others-where-the-doma/32828629#32828629
* https://stackoverflow.com/questions/31860020/sec7117-error-when-trying-to-load-a-javascript-file-in-ms-edge

[Top](#top)
