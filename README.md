# prenent

[![NPM](https://img.shields.io/npm/v/prenent.svg?label=prenent)](https://www.npmjs.com/package/prenent) [![Downloads/week](https://img.shields.io/npm/dw/prenent.svg)](https://npmjs.org/package/prenent) [![License](https://img.shields.io/badge/License-BSD%203--Clause-brightgreen.svg)](https://raw.githubusercontent.com/salesforcecli/prenent/main/LICENSE.txt)

SF plugin to combine several xml packages into one

## Install

```bash
sf plugins install @entlog/prenent
```

## Usage

If you want to create a package from 2 different files use:

```
sf prenent package merge -i file1.xml -i file2.xml -o merged.xml
```

For the help execute:

## Details

### Merged version

The merged file will always contains the biggest version found in the input files.

### Comments in packages

This plugin not only merges the types included in your package but also the comments. If you place a comment before the Package tag it will be moved to the merged file.
The comments before any type will be moved as well. With an example, given files:

<br/>
file1
<pre>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!-- Deployment details... --&gt;
&lt;Package xmlns="http://soap.sforce.com/2006/04/metadata"&gt;
   &lt;types&gt;
      &lt;members&gt;Account&lt;/members&gt;
   &lt;name&gt;CustomObject&lt;/name&gt;
   &lt;/types&gt;
   &lt;version&gt;64.0&lt;/version&gt;
&lt;/Package&gt;
</pre>

<br/>
file2
<pre>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;Package xmlns="http://soap.sforce.com/2006/04/metadata"&gt;
   &lt;!-- Details on custom objects --&gt;
   &lt;types&gt;
      &lt;members&gt;Case&lt;/members&gt;
   &lt;name&gt;CustomObject&lt;/name&gt;
   &lt;/types&gt;
   &lt;version&gt;64.0&lt;/version&gt;
&lt;/Package&gt;
</pre>

The result will include both comments as follows:

<pre>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!-- Deployment details... --&gt;
&lt;Package xmlns="http://soap.sforce.com/2006/04/metadata"&gt;
   &lt;!-- Details on custom objects --&gt;
   &lt;types&gt;
      &lt;members&gt;Account&lt;/members&gt;
      &lt;members&gt;Case&lt;/members&gt;
   &lt;name&gt;CustomObject&lt;/name&gt;
   &lt;/types&gt;
   &lt;version&gt;64.0&lt;/version&gt;
&lt;/Package&gt;
</pre>
