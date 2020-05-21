# BBC Sound Effect Downloader

**bbcFxDownloader** is a simple max4live device that allows you to download a random sample from the [BBC Sound Effect database](http://bbcsfx.acropolis.org.uk/).

On this repo you will find the Max 8 project that was used to build the device. 
The device itself can be found on the [maxforlive website](https://maxforlive.com/library/device.php?id=6305).

The core of the device is in Javascript. I used [Node for Max](https://docs.cycling74.com/nodeformax/api/) with the packages [request](https://www.npmjs.com/package/request) and [csv-parser](https://www.npmjs.com/package/csv-parser) to download the soundfile.

**/!\\** This device require the object node.script to run i.e. **Max 8.0.0 or greater**
