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

* Users access the public interface for our 360 services on a non-UNT domain. There used to be a security feature in MS Edge that prevented us from hosting any of our custom assets on a UNT server, where Edge would block UNT assets hosted on a non-UNT site accessed from on-campus computers. **This is no longer an issue with recent versions of Edge.** I suspect that the switch to Chromium changed that behavior.

* We *were* hosting our local assets directly via GitHub, using free CDN services enabling us to serve raw files that way. We no longer have to do that, and I am updating this README and the associated workflows to reflect this.

[Top](#top)


### Workflows

Before getting started, clone this repository to a local working directory if you haven't already.

```git clone https://github.com/unt-libraries/assets360.git assets360```


#### Starting a New Set of Edits

1. Locally, create a new branch from `master` and check it out, to start your edits. Push the new branch to the repository.

2. On the remote server currently hosting the files, create a second working directory (to serve as a staging area) and clone the repository there. E.g., `assets360_A` may be the live working directory; create `assets360_B` and clone the repository there. Switch to the new working branch.

3. Open the `footer.html`, `header.html`, and `meta.txt` files from the `snippets` directory. These _should_ match whatever is currently in the admin console in the Client Center.

4. In all three files, you need to switch references pointing to the current live version of each asset over to the new working. E.g., do a global find/replace in your text editor to find the old URL and replace it with the new URL.

5. Log into the Admin Console on the SerialsSolutions Client Center site and open the 360 Core E-journal Portal administration console (version 1).

6. In the **branding options** section, update the **Header** and **Footer** sections. Click the "Edit" button in the upper right to make these fields editable. Copy the text from your open version of `header.txt` into **Header** and `footer.txt` into **Footer**. Click "Save."

7. In the **advanced options** section, find the **Head HTML** text field. Click the "Edit" button, and then copy from your open version of `meta.txt` and paste into the form field. Click "Save."

8. Click the "Preview" button to open a preview of your changes. Double check to make sure it looks correct and is now referencing the working copy of the files. At this point nothing should have visibly changed except where the asset files it's referencing are.

9. Now you can work on changes as needed, using the new working branch. Change/edit files, delete files, and add new files. Whenever you update code in the admin console you have to refresh the preview by hitting the Preview button again.


#### Finishing and Prepping Edits for Deployment

When you're finished with your edits, just merge the new working branch into master and make sure the remote working copy is synched up.

If you would like, you can create a new tag for this version, but it is not strictly necessary. E.g., if the new version is v2.0.1:

        git tag -a v2.0.1 -m "This version contains ..."
        git push origin --tags

At around 8:30 AM the next morning, your changes should be reflected on the live site once the data refresh happens.


#### End of the Day, Edits are NOT Complete

If your changes won't be finished before the end of the day, then you need to make sure all of the HTML snippets are reverted back to their previous state before you leave so that your changes don't go live the next morning.

1. Make sure all of the changes you've made are saved to the working branch in the repository and pushed to GH.

2. Open up the `footer.html`, `header.html`, and `meta.txt` files from the `snippets` directory of whatever branch is *currently* live, probably `master`.

3. In the SerialsSolutions Client Center site, copy and paste from each of the above files into the relevant Header, Footer, and Head HTML sections. **Be sure to do this both for the E-journal Portal _and_ 360 Link.**

4. Add an HTML comment at the top of one of the Header or Head HTML sections. The next morning around 8:30 or 9:00 you can check the live site to see if your comment appears so you know the data refresh is done and you can resume working.

5. The next day, **after the data refresh has happened**, open the working version of each of the three `footer.html`, `header.html`, and `meta.txt` snippets, copy and paste them back into the admin console fields, and get back to work.

[Top](#top)


### Development Tips

* Don't forget that the E-journal Portal _and_ 360 Link both need to be updated and checked.

* Pressing the Preview button in one section of the admin console only regenerates the preview for that one service but not the other. After you update each you have to press the Preview button for each.

* Clicking "Preview" in 360 Link takes you to a journal page that automatically redirects to the publisher's site, which means you can't actually view the link resolver page that way. So how do you actually preview changes to 360 Link?

#### How to Preview 360 Link

1. If you've updated the header, footer, or head HTML sections of 360 Link in the admin console, then you must click the "Preview" button after saving them in order to regenerate the 360 Link preview. Don't skip this step, even though it will take you to an external journal site.

2. Open the E-journal Portal preview site. Search or browse for an e-journal.

3. Copy the below portion of the URL in your browser. (Or just copy it from here.)

        http://ae.preview.serialssolutions.com/?L=DQ4WU5NL3D&

4. Click "More full text options" for any of the journals. This takes you to a 360 Link page for the live site.

5. In your browser's address bar, highlight this part of the URL: `http://dq4wu5nl3d.search.serialssolutions.com/?`. Paste the above text in its place and hit enter load the new URL. This takes you to the preview version of that page.

[Top](#top)
