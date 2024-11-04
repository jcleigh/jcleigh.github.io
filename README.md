# jcleigh

This repository contains the source code for my personal blog site hosted on GitHub Pages at [https://jcleigh.github.io](https://jcleigh.github.io). The site is built using Jekyll and the `minimal-mistakes` theme.

## Building and Publishing the Site

To build and publish the site using GitHub Pages, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/jcleigh/jcleigh.github.io.git
   cd jcleigh.github.io
   ```

2. Install the required gems:
   ```sh
   bundle install
   ```

3. Build the site:
   ```sh
   bundle exec jekyll build
   ```

4. Serve the site locally:
   ```sh
   bundle exec jekyll serve
   ```

5. Commit and push your changes to the `main` branch. GitHub Pages will automatically build and publish the site.
