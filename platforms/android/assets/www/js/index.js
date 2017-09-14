/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 /*

    to do
    - test test of git

    
    - after deleting item, it gets buggy?

    


    done:

    - when new product is added, divs hide in strange order, it looks bad
    - after adding new product, its thumbnail should dissappear and not be seen further
    - repair editing
    - deleting items
    - when filtering products, CN/CT/SH 'headline' is shown
 */

var userdata = {
        "countries":{"all countries":{"all cities":{"all shops":{"name":"all shops", "prods":[]}}}}
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //console.log("cv file",cordova.file);
        /*alert("hi22\napp dir\n"+cordova.file.applicationDirectory + "\n\n" + 
                "data dir\n"+cordova.file.dataDirectory + "\n\n" + 
                "app storage dir\n"+cordova.file.applicationStorageDirectory + "\n\n" +
                "cache storage dir\n"+cordova.file.cacheDirectory + "\n\n" +
                "exter root dir \n"+cordova.file.externalRootDirectory + "\n\n" +
                "exter data dir \n"+cordova.file.externalDataDirectory + "\n\n" +
                "temp dir \n"+cordova.file.tempDirectory
                );*/
        

    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        var imageToSave, resBlob;

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:none;');

        //console.log('Received Event: ' + id);
        
        loadStoredData();

        //alert("spot 1");

        /*TTS.speak({
            text: 'hallo meine liebe, was ist das',
            locale: 'de-DE',
            rate: 1
        }, function () {
            alert('Text succesfully spoken');
        }, function (reason) {
            alert(reason);
        });*/
        


        var cam = document.getElementById('cam');

        var camoptns = { quality: 50
                    , destinationType: /*Camera.DestinationType.*/ 1 //FILE_URI 
                    , targetWidth: 720
                    , targetHeight: 1280
                    //, allowEdit :true
                    };

        cam.addEventListener('click', function(){


                    document.getElementById("myCanvas").style.display = "none";

                    //  https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-media-capture/

                    //navigator.device.capture.captureImage(function(files){
                    navigator.camera.getPicture(function(imgUri){

                            
                            imageToSave = imgUri;
                            
                            //for (var prop in imgUri){logg(prop);}

                                //logg("path? "+files.fullPath);
                                //logg("uri" + files.localURL);
                                //logg("name" + files.name);

                                //var img = document.getElementById('pic').src = files;
                                //img.setAttribute("class", "preview");


                            // shows submit button
                            document.getElementById('prodSubmit').style.display = "block";

                            // files, blobs url conversions etc
                            // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript/16245768#16245768

                            displayThumb(imageToSave, function(x){
                                        
                                        resBlob = x;

                                        //saveFile(filename, newCont,cb)
                                        /*saveFile('111_test.jpg', x,function(){

                                            alert("done");
                                                })*/

                            });
                            

                            }, function(err){

                                    alert("cam error");

                            }, camoptns
                    )//, options)
        })
    
        // onclick confirm new product
        document.getElementById('prodSubmit').addEventListener("click", function(){



                                    submitNewProduct(function(fname){

                                            //alert(resBlob.type);
                                            //saveFile(fname, resBlob,updateDisplay);
                                            //alert(fname); return
                                            //window.resolveLocalFileSystemURL(imageToSave, function success(fileEntry) {

                                            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {    
                                                        //alert("about to save img" + fname + "<<");
                                                        dirEntry.getFile(fname, {create: true, exclusive: false}, function(fileEntry){

                                                                fileEntry.createWriter(function(fw){

                                                                        fw.onwriteend = function(){

                                                                                //alert("img file saved");
                                                                                saveDataFile(updateDisplay)

                                                                        }


                                                                        fw.onerror = function(e){

                                                                                alert(e);
                                                                        }


                                                                        fw.write(resBlob)
                                                                })

                                                        }, function(er){

                                                            alert("code 888");}
                                                        )
                                                        //alert("got file: " + fileEntry.fullPath);
                                                            /*logg("namae   " + fileEntry.name)

                                                            for (prop in fileEntry){
                                                                logg(prop + "  " + fileEntry[prop]);
                                                            }*/
                                                            /*alert(resBlob.type);
                                                            saveFile(fname, resBlob,updateDisplay);
                                                            alert("done?");*/
                                                            //saveImg(fileEntry, fname, updateDisplay);


                                            }, function(er){ 
                                                    alert("123 + er\n" + JSON.stringify(er))  
                                            })
    
                                    })

        })
        function updateDisplay(){

                            document.getElementById('addProductDiv').style.display = "none";
                                /* button */ document.getElementById('prodSubmit').style.display = "none";

                            /* show + button */ document.getElementById('addProductButton').style.display = "flex";

                            // this was originally elsewhere
                            document.getElementById('productsDiv').style.display = "block";
                            document.getElementById('filterProds').style.display= 'flex';

                            // remove img thumbnail
                            document.getElementById('pic').src = "";

                            // empty canvas
                            var canvas = document.getElementById("myCanvas");
                                canvas.style.display = 'none';

                                var c = canvas.getContext("2d");
                                c.clearRect(0,0,360,360);

                            // empty all textfileds && rating

                            //alert("now loading products anew");
                            loadProducts();
        }

    }
};

function success(fileEntry){
            //alert( "got the file object" + "\n"+ cordova.file.dataDirectory )
            readFile(fileEntry)
}
function fail(error){

        // if file doesnt exist, create it
        
        if (error.code === 1) {
                    //alert("no userdata file");

                    saveDataFile(loadStoredData);


        } else alert(  JSON.stringify(error));

}
function displayThumb(file, cb){

                
                var img = document.getElementById('pic');
                img.src = file     //.fullPath;


                img.setAttribute("class", "preview");
                img.style.display = "none";

                document.getElementById("myCanvas").style.display = "block";

                var canvas = document.getElementById("myCanvas");
                    canvas.setAttribute("class", "preview");
                    canvas.style.display = 'block';
                    //canvas.style.border = "2px solid";
                var c = canvas.getContext("2d");

                setTimeout(function(){
                        c.drawImage(img,         // 720 x 1280                   720 / 2 = 360 / 2 = 180
                                          0,320, // where to start clipping     1280 / 2 = 640 / 2 = 320
                                        720, 640,  // w h of clipped image     
                                          0,0   // where to draw it on canvas

                                        , 360, 360
                                        )

                        //var base64 = canvas.toDataURL('image/jpg');  //'image/jpg'

                        //fetch(base64).then(function(res){ return res.blob()}).then(function(blob){ alert(blob)})
                        //alert(base64)
                        canvas.toBlob(function(result){

                            /*window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, //{ create: false , exclusive: false } ,
                                    
                                    function(DIRentry){

                                            DIRentry.getFile( "222.jpg", {create: true, exclusive: false}, 
                                                    function(fileEntry){

                                                            fileEntry.createWriter(function (fileWriter) {

                                                                    fileWriter.onwriteend = function() {

                                                                        alert("Successful file write...");
                                                                        //loadStoredData();
                                                                        //if (cb) cb()
                                                                        //readFile(fileEntry);
                                                                        //alert("file written");
                                                                    };

                                                                    fileWriter.onerror = function (e) {
                                                                        alert("Failed save data...");// + e.toString());
                                                                    };

                                                                    // If data object is not passed in,
                                                                    // create a new Blob instead.
                                                                    //if (!dataObj) {
                                                                    //    alert("no data to write");
                                                                    //    dataObj = new Blob(['dataObj'], { type: 'text/plain' });
                                                                    //}

                                                                    fileWriter.write(smtX);
                                                                });

                                                    }, function (er){

                                                        alert("QQQQQ\n" + JSON.stringify(er))
                                                    }
                                            )
                                            //alert("entry");
                                            //writeFile(entry, smtX)

                                    },function(er){ 

                                        alert ("------"); //JSON.stringify(er));     
                                    });
                                */
                                //alert("hi");


                                    if (cb) cb(result)
                        });
                        //b64toBlob(base64, 'image/jpg')

                }, 500)




                

                function b64toBlob(b64Data, contentType, sliceSize) {
                    contentType = contentType || '';
                    sliceSize = sliceSize || 512;

                    //alert("jjjjj");
                    var byteCharacters = atob(b64Data);
                    var byteArrays = [];

                    alert("kkk")

                    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                        var slice = byteCharacters.slice(offset, offset + sliceSize);

                        var byteNumbers = new Array(slice.length);
                        for (var i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);

                        byteArrays.push(byteArray);
                    }

                    var blob = new Blob(byteArrays, {type: contentType});

                    
                    alert(//blob.type + "   " + 
                            blob.size)
                    return blob;
                }
}
function readFile(fileEntry) {

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
            console.log("Successful file read: " + this.result);
            //displayFileData(fileEntry.fullPath + ": " + this.result);
            logg(this.result);
            //userdata = JSON.parse(this.result)
            //updateCountries()
            //log(file);
        };

        reader.readAsText(file);

    },function(er){alert("ERR to read file")});
}

function loadStoredData(){

            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory+'userdata.txt',function(fileEntry){

                            fileEntry.file(function (file) {
                                                var reader = new FileReader();

                                                reader.onloadend = function() {
                                                    console.log("Successful file read: " + this.result);
                                                    //displayFileData(fileEntry.fullPath + ": " + this.result);
                                                    logg(this.result);
                                                    userdata = JSON.parse(this.result);

                                                    updateCountries(function(){
                                                        //updateCities(function(){
                                                        //    updateShops(function(){
                                                                loadLastLocations(loadProducts);
                                                           // })
                                                        //})
                                                        
                                                        //loadProducts();

                                                    });

                                                    

                                                    //log(file);
                                                };

                                                reader.readAsText(file);

                                        },function(er){alert("ERR")});

            },fail);
}
function loadLastLocations(cb){

            var cn = userdata.lastOpenCountry,
                ct = userdata.lastOpenCity,
                sh = userdata.lastOpenShop;

            

            // sets country

            var x = document.getElementById('CountrySel').children;

            for (var i=0; i< x.length; i++){

                //alert("text: "+x[i].text);

                if ( x[i].text === cn) x[i].selected = true;
            }


            updateCities(function(){

                        var cities = document.getElementById('CitySel').children;
                        for (var i=0;i<cities.length;i++){

                            if ( cities[i].text === ct) cities[i].selected = true;
                        }

                        updateShops(function(){

                                    var shops = document.getElementById('ShopSel').children;
                                    for (var i=0;i<shops.length;i++){

                                        if ( shops[i].text === sh) shops[i].selected = true;
                                    }
                                    if (cb) cb();
                        });
            });
}
function saveDataFile(cb){
                window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,function(dirEntry){

                            dirEntry.getFile("userdata.txt", { create: true, exclusive: false }, function (fileEntry) {

                                    
                                    //alert("about to save data 0");
                                    //if (! userdata.lastOpenCountry) 
                                            userdata.lastOpenCountry = document.getElementById("CountrySel").querySelector("option:checked").text;

                                    //alert("about to save data 1");
                                        if (document.getElementById("CitySel").querySelector("option:checked").text)    
                                            userdata.lastOpenCity = document.getElementById("CitySel").querySelector("option:checked").text;

                                    //alert("about to save data 2");
                                        if (document.getElementById("ShopSel").querySelector("option:checked").text){    
                                                            userdata.lastOpenShop = document.getElementById("ShopSel").querySelector("option:checked").text;}
                                    
                                    //alert(JSON.stringify( userdata));
                                    //alert("about to save data 3");
                                    writeFile(fileEntry, userdata, cb);

                                    //if (cb) cb();
                            })
                })    
}
function saveFile(filename, newCont,cb){

            //alert("filename: " + filename)

            window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory + filename, { create: true, exclusive: false } ,function(entry){



                    writeFile(entry, newCont, cb)

            },function(er){ alert (JSON.stringify(er));     });
}
function writeFile(fileEntry, dataObj, cb) {
    // Create a FileWriter object for our FileEntry (log.txt).

    //alert(dataObj);
    //if (! dataObj) alert("no dataObj");

    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {

            //alert("Successful file write...");
            //loadStoredData();
            if (cb) cb()
            //readFile(fileEntry);
            //alert("file written");
        };

        fileWriter.onerror = function (e) {
            alert("Failed save data...");// + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            alert("no data to write");
            dataObj = new Blob(['dataObj'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}
function saveImg(file, filename, cb){

                    //moveFile(file.fullPath,cb);

                    moveFile( file.nativeURL, cb); 


                    function moveFile(uri,cb) {

                            //alert(uri)

                            window.resolveLocalFileSystemURL( uri,

                                    function(fileEntry){
                                        window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
                                            function(dirEntry) {


                                                    fileEntry.moveTo(dirEntry, filename, function(entry){
                                                        //alert("File moved.check internal memory");

                                                        saveDataFile(function(){

                                                                    if (cb) setTimeout(function(){

                                                                            cb();
                                                                    },200)

                                                        });

                                                        

                                                    },resOnError);
                                                },
                                                resOnError);


                                    },function(er){ alert("1111111\n" + JSON.stringify(er))  });}

                    function resOnError(er){ alert(" img save error" + JSON.stringify(er))}

                    /*window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory+'bjr1.txt',function(entry){

                    writeFile(entry, newCont)
                    },function(er){ alert ("write Err");});*/
}

function fsSuccess(fs){

                //log();
                window.FS = fs;

                    //alert(fs.root.fullPath);
                    console.log("root",fs.root);
                    //alert("sukces\n" +fs.fullPath)//.toURL());
                    //alert( cordova.file.externalDataDirectory)
                   // listDir(fs, fs.root.fullPath.toString())


                var printDirPath = function(entry){
                    console.log("Dir path - " + entry.fullPath);
                }
        
                //createDirectory("this/is/nested/dir", printDirPath);
                //createDirectory("simple_dir", printDirPath);

                console.log("?",fs.root.getDirectory.toString())
                fs.root.getDirectory("", function(entry){

                            //alert(entry.isDirectory);

                }, function(){ //alert("dir err");
                })


}
function listDir(fs, path){

        var cons = document.getElementById("console");

        // window.resolveLocalFileSystemURL("/",
        //   function (fs) {
                var reader = fs.createReader();
                reader.readEntries(
                function (entries) {
                    
                    cons.innerText = "sukces?"// + entries;
                    console.log("entries", entries);
                },
                function (err) {
                    alert("er1"+err);
                }
              );
        //    }, function (err) {
        //      alert("err 2"+err);
        //    }
        //  );
}
function fsFail(event){

                    alert("error"+evt.target.error.code);
}
function addProduct(){

        //alert(document.getElementById('CountrySel').querySelector('option:checked').text );

        

        /*if ( document.getElementById('CountrySel').querySelector('option:checked').text === "all countries") {

                            //alert("choose country first"); 
                            //document.getElementById('addProductButton').style.display = "flex";

                            //return
        } else {*/
                document.getElementById('addProductButton').style.display = "none";

                document.getElementById('addProductDiv').style.display = "block";
                document.getElementById('cancelAddProduct').style.display = "flex"; 

                document.getElementById('productsDiv').style.display = "none";

                document.getElementById('filterProds').style.display= 'none';

        //}
}
function cancelAddProduct(){

                document.getElementById('addProductButton').style.display = "flex";

                document.getElementById('prodSubmit').style.display = "none";

                document.getElementById('addProductDiv').style.display = "none";
                document.getElementById('pic').src = "";

                document.getElementById('productsDiv').style.display = "block";
                document.getElementById('filterProds').style.display= 'block';
}
function submitNewProduct(cb){

                

                var prodType = document.getElementById('prodType').value

                //make sure type is filled in
                if (prodType === "") {  alert("fill in product type"); return  }
                
                                //var radios = document.querySelector('input[name = "rating"]:checked').value;


                // get P name and Desc
                if (document.getElementById('prodName').value !== "") var prodName = document.getElementById('prodName').value.toString();
                if (document.getElementById('prodDesc').value !== "") var prodDesc = document.getElementById('prodDesc').value.toString();


                // check for radios - one must be checked
                if (!document.querySelector('input[name = "rating"]:checked')) {alert ("choose rating"); return}

                var rating = document.querySelector('input[name = "rating"]:checked').value;

                //if (radios === undefined) {alert("choose rating"); return}



                // picture
                var d = new Date();
                    
                var filename =  d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + " " + 
                                d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds() + ".jpg";

                                //alert("filename"+ filename);

                // save to proper place in userdata

                var country = document.getElementById("CountrySel").querySelector("option:checked").text;
                var city    = document.getElementById("CitySel").querySelector("option:checked").text;
                var shop    = document.getElementById("ShopSel").querySelector("option:checked").text;

                //alert("country " + country + " " + city + " " + shop);

                var newP = {    "id": filename.replace(".jpg",""),
                                "prodType": prodType,
                                //"prodName": prodName,
                                //"prodDesc": prodDesc,
                                "rating": rating,
                                "filename": filename
                            }

                        if (prodName) newP.prodName = prodName;
                        if (prodDesc) newP.prodDesc = prodDesc;
                



                if (!userdata.countries[country].hasOwnProperty(city)) {
                                            var njuCity = {};
                                            //njuCity[shop] = 

                                            userdata.countries[country][city] = njuCity;
                                            //alert("new city?" + JSON.stringify( userdata.countries[country]));
                   // 
                } else{

                }

                if (!userdata.countries[country][city].hasOwnProperty(shop)){

                                            var njuShop = {};
                                                njuShop.name = shop.toString();
                                                njuShop.prods = [];

                                            userdata.countries[country][city][shop] = njuShop;
                                            //alert("new shop?" + JSON.stringify( userdata.countries[country][city]));

                                            userdata.countries[country][city][shop].prods.push(newP);

                                            //alert("newly: " + JSON.stringify( userdata.countries[country][city][shop]));//[city][shop] ) );

                                            setTimeout(function(){

                                                        //saveDataFile();

                                                            // jpg format -> to save image
                                                        if (cb) cb(filename);

                                                        // this is elsewhere and it works better there
                                                            //document.getElementById('productsDiv').style.display = "block";
                                                            //document.getElementById('filterProds').style.display= 'flex';

                                                        initializeForm()

                                            }, 500);
                                            //saveDataFile();

                                            

                                            //if ()

                // if it has the shop                   
                } else {                    //alert("shop is there");
                                            userdata.countries[country][city][shop].prods.push(newP);

                                            setTimeout(function(){

                                                        //saveDataFile();

                                                            // jpg format -> to save image
                                                        if (cb) cb(filename);

                                                        // this is elsewhere and it works better there
                                                            //document.getElementById('productsDiv').style.display = "block";
                                                            //document.getElementById('filterProds').style.display= 'flex';

                                                        initializeForm()
                                                        
                                            }, 500);

                }

}



function openInput(el){

            var cn = document.getElementById("CountrySel").querySelector("option:checked").text,
            ct     = document.getElementById("CitySel").querySelector("option:checked").text,
            sh     = document.getElementById("ShopSel").querySelector("option:checked").text;

            document.getElementById('filterProds').style.display= 'none';

            var id1 = "add" + el + "Div";

            var div = document.getElementById(id1);
            div.setAttribute("class", "addLocationVisible");

            document.getElementById("add"+el+"In").focus();

            var id = el + "Sel"
            

            //var options = document.getElementById(id).childNodes;
            //var countries = document.getElementById("CountrySel").childNodes;
            //var cities    = document.getElementById("CitySel").childNodes;

            //console.log(countries)


            //if (id === "CitySel" && countries.length === 0) {alert("no cntries, add country first"); hideLocInput(el);}
            //else if (id === "ShopSel" && (countries.length === 0 || cities.length === 0)) {alert("no cities, add one country & city"); hideLocInput(el);}

            if ( id === "CitySel" && cn === 'all countries'){ alert("choose country first"); hideLocInput(el); }
}
function hideLocInput(el){

            var id = "add" + el + "Div";
            document.getElementById(id).setAttribute("class", "addLocation");

            document.getElementById('filterProds').style.display= 'block';
}
function confLocation(item){

            

            var country = document.getElementById("CountrySel").querySelector("option:checked").text;

                        // document.getElementById("CountrySel").querySelector("option:checked").text;
            if (document.getElementById("CitySel").querySelector("option:checked"))
            var city    = document.getElementById("CitySel").querySelector("option:checked").text;

            /*console.log(countries)

                for (var i=0;i<countries.length; i++){

                    console.log( countries[i].getAttributeNode("selected").value );

                    if (countries[i].getAttributeNode("selected").value === true) {country = countries[i].text; break }
                }*/
            console.log("country", country, city);

            console.log("userdata.countries",userdata.countries);

            var what = "add" + item + "In";

            console.log("input", document.getElementById(what).value )


            // this branch adds item to its place in JSON structure
            var newItem = document.getElementById(what).value

            if ( document.getElementById(what).value !== "" ) {

                    //first check if the same item is already there
                    
                    if (item === "Country"){   

                                            console.log("item",item, "new", newItem);//, "prop", prop);
                                            //console.log("prop", userdata.countries[prop]);
                                            if (userdata.countries.hasOwnProperty(newItem)){
                                            
                                                                        alert("already there, change name");
                                                                        console.log("     ITS THERE    ");
                                                                        return
                                                                        
                                            } else {

                                                userdata.countries[newItem]={
                                                                                "all cities": {"all shops":{"name":"all shops", "prods":[]}}
                                                                            };
                                                hideLocInput(item);
                                            
                                                

                                                //saveFile('userdata.txt', userdata);
                                                saveDataFile();
                                                updateCountries(function(){//);

                                                //setTimeout(

                                                        //alert("timeout function");
                                                        // this should make newly added country as selected
                                                        //(function(){

                                                                var cntries = document.getElementById('CountrySel').children;//querySelectorAll('option');
                                                                //alert(cntries);

                                                                for (var i=0;i<cntries.length;i++){

                                                                    //alert(cities[i].text);
                                                                    if ( cntries[i].text === newItem) cntries[i].selected = true;
                                                                    else cntries[i].selected = false;
                                                                }

                                                                updateCities(function(){

                                                                            updateShops(loadProducts);
                                                                });

                                                       // })()

                                                //}, 100);
                                                })
                                                return
                                            }

                    // if adding a city

                    } else if (item === "City"){

                        if (userdata.countries[country].hasOwnProperty(newItem)) {

                                        alert("city already there"); 
                                        return
                        } else {

                                userdata.countries[country][newItem] = {
                                                                            "all shops" : {"name":"all shops", "prods":[]}
                                                                        };

                                updateCities(function(){


                                                    // newly added item is selected
                                                    var cities = document.getElementById('CitySel').children;//querySelectorAll('option');
                                                    //alert("c.length" + cities);
                                                    for (var i=0;i<cities.length;i++){

                                                        //alert(cities[i].text);
                                                        if ( cities[i].text === newItem) cities[i].selected = true;
                                                    }
                                                    updateShops(function(){

                                                                saveDataFile();
                                                                loadProducts();  
                                                    });     

                                });
                                //loadStoredData();
                                
                                hideLocInput(item);
                                return  

                        }
                       


                    // if adding a shop

                    } else if (item === "Shop"){

                        console.log("     country", country, city, newItem);

                        if (userdata.countries[country][city].hasOwnProperty(newItem)) {

                                            alert("shop already there"); 
                                            return

                        } else {

                                var njuShop = {};
                                                njuShop.name = newItem.toString();
                                                njuShop.prods = [];

                                userdata.countries[country][city][newItem] = njuShop;
                                

                                updateShops(function(){

                                        // this code makes newly added shop Selected

                                        var shops = document.getElementById('ShopSel').children;//querySelectorAll('option');
                                                    
                                        for (var i=0; i<shops.length; i++){
        
                                                if ( shops[i].text === newItem) shops[i].selected = true;

                                        }

                                        loadProducts();
                                        saveDataFile();

                                })

                                //saveFile('userdata.txt', userdata);
                                

                                hideLocInput(item);
                                
                                return  

                        }
                        //for (var city in userdata.countries[country]){}

                    

                    } else alert("something else wants to be added");//document.getElementById(what).setAttribute("placeholder", "write " + item + " first")  


            } else if (document.getElementById(what).value === "") { alert("name is required, please fill in"); return}
        
}
function saveLastLocations(cb){

            userdata.lastOpenCountry = document.getElementById("CountrySel").querySelector("option:checked").text;
            userdata.lastOpenCity    = document.getElementById("CitySel").querySelector("option:checked").text;
            userdata.lastOpenShop    = document.getElementById("ShopSel").querySelector("option:checked").text;

            //alert(userdata.lastOpenCountry + " > "  +  userdata.lastOpenCity + " > " + userdata.lastOpenShop);

            //alert(typeof "DOM" === 'string');
            saveDataFile();


            if (cb && typeof cb === 'string' && cb === "DOM") {
                        //alert("called from DOM");
                        loadProducts();

            }
}
function updateCountries(cb){

        var cn = document.getElementById('CountrySel').querySelectorAll('option'), 
            ct = document.getElementById('CitySel').querySelectorAll('option'),
            sh = document.getElementById('ShopSel').querySelectorAll('option');

                    log("cn,ct,sh", cn,ct,sh);

                    cn.forEach(function(el,i){
                            el.remove();
                    })
                    ct.forEach(function(el,i){
                            el.remove();
                    })
                    sh.forEach(function(el,i){
                            el.remove();
                    })


                   //log("cn",cn,ct,sh);

        //add all countries option to Select

        /*var all = document.createElement('option');
            all.text = "all countries";
            document.getElementById('CountrySel').appendChild(all);*/

        // adds each country to Select

        for (var prop in userdata.countries){
            
            var njuOpt = document.createElement('option');
            njuOpt.text = prop.toString();
            //if (document.getElementById(what).value === njuOpt.text) njuOpt.selected = true;
            document.getElementById('CountrySel').appendChild(njuOpt);
            //document.getElementById('CountrySel').insertBefore(njuOpt, document.getElementById('CountrySel').childNodes[0]);

        }
        // if its supposed to exec a callback
        if (cb && typeof cb === 'function') (function(){

                    //alert("countries: cb");
                    cb();
                    
        })()
        
        else if (!cb) {  //alert("countries: no callback -> saveDataFile");//
                    saveLastLocations();  
        }
}
function updateCities(cb){

            var country = document.getElementById("CountrySel").querySelector("option:checked").text;
            var ct = document.getElementById('CitySel').querySelectorAll('option');
            var sh = document.getElementById('ShopSel').querySelectorAll('option');

            //alert("ct.length  " + ct.length);

            for (var i=0;i<ct.length;i++){
                        //alert("el " + ct[i]);
                        ct[i].remove();
            }

            /*ct.forEach(function(el,i){
                            alert("el " + el);
                            el.remove();
                    })
            sh.forEach(function(el,i){
                            el.remove();
            })*/

            

            /*var all = document.createElement('option');
                all.text = "all shops";
                document.getElementById('ShopSel').appendChild(all);*/



            for (var city in userdata.countries[country]){

                    var njuCity = document.createElement('option');
                    njuCity.text = city;
                    document.getElementById('CitySel').appendChild(njuCity);
            }


            // this adds "all cities" to list of cities if its not in userdata
            var cities = document.getElementById('CitySel').querySelectorAll('option'),
            foundAll = false;
            for (var i=0; i<cities.length; i++){
                        if(cities[i].text === 'all cities') {foundAll=true; break }

                        if (i === cities.length-1 && !foundAll){

                                    //alert("no 'ALL cities' found");
                                    var all = document.createElement('option');
                                    all.text = "all cities";
                                    document.getElementById('CitySel').insertBefore(all, document.getElementById('CitySel').childNodes[0]);

                        }
            }
            //alert(typeof cb);

            if (cb && typeof cb === "function") {
                //alert ("cities: CB");
                cb()

            }
            else if (cb && typeof cb === 'string' && cb ==="DOM"){
                //alert("DOM");
                //alert ("cities: no callback -> saveDataFile");
                updateShops();
                
                loadProducts();
                saveLastLocations();
            }

            //saveLastLocations();
}
function updateShops(cb){


            var country = document.getElementById("CountrySel").querySelector("option:checked").text;
            var city    = document.getElementById('CitySel').querySelector('option:checked').text;
                console.log("city", city, document.getElementById('CitySel').querySelectorAll('option:checked'));

            sh = document.getElementById('ShopSel').querySelectorAll('option');
            //alert (sh.length);

            for (var i = 0; i<sh.length;i++){

                    sh[i].remove()
            }
            /*sh.forEach(function(el,i){
                            el.remove();
            })*/
            /*var all = document.createElement('option');
            all.text = "all shops";
            document.getElementById('ShopSel').appendChild(all);*/
            //console.log("co, ci", country, city);


            // append shops from userdata list

            for (var s in userdata.countries[country][city]){

                            //alert("shop " + s);
                            var shop = document.createElement('option');
                            shop.text = s;
                            document.getElementById('ShopSel').appendChild(shop);
            }


            // append "all shops" option if its not in data

            var shops = document.getElementById('ShopSel').querySelectorAll('option'),
                foundAll = false;
            //alert("shops.length " + shops.length);
            if (shops.length===0){
                                    var all = document.createElement('option');
                                    all.text = "all shops";
                                    document.getElementById('ShopSel').appendChild(all);
            
            } else {

                    for (var i=0; i<shops.length; i++){
                                if(shops[i].text === 'all shops') {foundAll=true; break }

                                if (i === shops.length-1 && !foundAll){

                                            //alert("no 'ALL shops' found");
                                            var all = document.createElement('option');
                                            all.text = "all shops";
                                            document.getElementById('ShopSel').insertBefore(all, document.getElementById('ShopSel').childNodes[0]);

                                }

                    }
            }
            
            // execute plain callback func
            if (cb && typeof cb === 'function') cb()

            // if called from DOM                
            else if (cb && typeof cb === 'string' && cb === "DOM" ){
                //alert("called from DOM");
                saveLastLocations();
                loadProducts();
            }
}



function loadProducts(){

            

            var par1 = document.getElementById('productsDiv');
                par1.innerHTML = "";
            

            var cn = document.getElementById("CountrySel").querySelector("option:checked").text,
            ct     = document.getElementById("CitySel").querySelector("option:checked").text,
            sh     = document.getElementById("ShopSel").querySelector("option:checked").text;

            //alert("load prods " + cn + " "+ct + " "+ sh);
            

            // if maximally specific location is chosen

            if (cn!=='all countries' && ct!=='all cities' && sh!=='all shops'){


                        var Ps = userdata.countries[cn][ct][sh].prods;
                        

                        if (Ps.length === 0) document.getElementById('productsDiv').innerHTML = '<p>no products to display</p>'

                        //var parent = document.getElementById('productsDiv');

                        Ps.forEach(function(p,i){

                                                                createProductDiv(p,i,cn,ct,sh);
                                                                    
                                                            })

            // if something is specified vaguely
            } else {


                        aggregateProds( function(results, ads, originalIndexes){

                                if (results.length === 0) { document.getElementById('productsDiv').innerHTML = '<p>no products to display</p>';
                                                            return
                                }

                                var prevLoc = '';

                                //alert("res: " + results.length + "  ads: " + ads.length + "  o.i. " + originalIndexes.length);
                                results.forEach(function(p,i){

                                            var currLoc = ads[i].cn + " / " + ads[i].ct + " / " + ads[i].sh
                                            

                                            if (prevLoc === '' || prevLoc !== currLoc){ 

                                                                //alert("empty " + currLoc);
                                                                var node = document.createElement('div')
                                                                    if (prevLoc==='') node.innerHTML = '<div class="currLoc first">'+ currLoc +'</div>'
                                                                    else node.innerHTML = '<div class="currLoc">'+ currLoc +'</div>'
                                                                    document.getElementById('productsDiv').appendChild(node);

                                                                prevLoc = currLoc;

                                            }

                                            createProductDiv(   p, originalIndexes[i] 
                                                                ,ads[i].cn, ads[i].ct, ads[i].sh
                                                            );
                                })

                        })
            }


            /*var target = document.getElementById('productsDiv');

            var img*/
}
function createProductDiv(pr, ind, cn, ct, sh){
            //alert(pr);

            var D = document.createElement('div');
            D.setAttribute("class", "displayedProductDiv");
            //if (pr.id) alert(pr.id)
            D.setAttribute("id", pr.id);

                    D.setAttribute("data-cn",cn);
                    D.setAttribute("data-ct",ct);
                    D.setAttribute("data-sh",sh);

                    //alert(D.getAttribute("data-cn") + " + " + D.getAttribute("data-ct") );

            var divImg = document.createElement('div');
            divImg.setAttribute('class', 'iD_initial');

                    //divImg.style = ""

                    var img = document.createElement('img');
                    img.src = cordova.file.externalDataDirectory + pr.filename;
                    img.setAttribute("class", "preview");


                    divImg.appendChild(img);

            

            var div = document.createElement('div');
            div.className = "productInfo";

            div.innerHTML = '<div style="">' + 

                    '<div style="font-size: 22px; font-weight: 300; margin-bottom: 5px">' + pr.prodType + '</div>' ;

                    if (pr.prodName) div.innerHTML += '<p>' + pr.prodName + '</p>'
                    if (pr.prodDesc) div.innerHTML += '<p>' + pr.prodDesc + '</p>'


                    // rating 
                    var r = pr.rating, r_text;

                    if      (r == 1) r_text = "avoid"
                    else if (r == 2) r_text = "buy only in crisis"
                    else if (r == 3) r_text = "good"
                    else if (r == 4) r_text = "very good"    

                    div.innerHTML += '<p>' + r_text + '</p>'


            div.innerHTML += '</div>'


            D.appendChild(divImg);
            D.appendChild(div);

            //if (pr.id) var x = pr.id.toString();
                //D.setAttribute("onmousedown", "startTimer()");
                //D.setAttribute("onmouseup"  , "endTimer()");
                //D.setAttribute("ondblclick", at);

            var counter = 0;
            D.addEventListener('click', function(ev){

                    //alert('click')
                    counter ++;
                    var el = ev.currentTarget

                    setTimeout(function(){

                            if (counter === 1){     counter = 0;
                                                    //alert("large")
                                                    enlargeItem(el);
                            }
                            if (counter > 1){       counter = 0;}
                    }, 200)

            });
            
            D.addEventListener('dblclick', function(ev){

                    editItem(ev.currentTarget, ev.currentTarget.id, ind);
                        //alert(D.srcElement.id + "  " + D.target.id + "  " + D.currentTarget.id)//.relatedTarget);
                        //document.getElementById('editPanel').style.display = "flex";
            });



            document.getElementById('productsDiv').appendChild(D);            



}
function aggregateProds(cb){

            var cn = document.getElementById("CountrySel").querySelector("option:checked").text,
            ct     = document.getElementById("CitySel").querySelector("option:checked").text,
            sh     = document.getElementById("ShopSel").querySelector("option:checked").text;

            var aggPs = [],
                adr   = [],
                origI = [];

            if (cn === 'all countries'){

                    if (ct === 'all cities' && sh === 'all shops'){

                            for (var CN in userdata.countries){

                                    for (var CT in userdata.countries[CN]){

                                            for (var SH in userdata.countries[CN][CT]){

                                                userdata.countries[CN][CT][SH].prods.forEach(function(item, i){

                                                        aggPs.push(item);
                                                        adr.push({cn:CN, ct:CT , sh:SH});
                                                        origI.push(i);
                                                })

                                            }
                                    }
                            }   
                            if (cb) {   cb(aggPs, adr, origI); 
                                        return
                            }
                    } else if (ct==='all cities' && sh !== 'all shops'){

                            for (var CN in userdata.countries){

                                for (var CT in userdata.countries[CN]){

                                    for (var SH in userdata.countries[CN][CT]){

                                            if (userdata.countries[CN][CT][SH].name===sh){

                                                    userdata.countries[CN][CT][SH].prods.forEach(function(item, i){

                                                            aggPs.push(item);
                                                            adr.push({cn:CN, ct:CT , sh:SH});
                                                            origI.push(i);
                                                    })
                                            }
                                    }
                                }
                            }   
                            if (cb) {   cb(aggPs, adr, origI); 
                                        return
                            }

                    // these two possibilities should not be possible anymore
                                } else if (ct!=='all cities' && sh ==='all shops'){

                                        for (var CN in userdata.countries){

                                            for (var CT in userdata.countries[CN]){

                                                    if (CT === ct){

                                                        //for (var SH in userdata.countries[CN][CT]){}
                                                    }
                                            }
                                        }
                                        alert('location nonsense1');
                                        return

                                        if (cb) {   cb(aggPs); 
                                                        return
                                        }

                                // go thru all countries, spec. ct && spec. sh and get its products        
                                } else if (ct!=='all cities' && sh !=='all shops'){

                                        for (var CN in userdata.countries){

                                            for (var CT in userdata.countries[CN]){

                                                    if (CT === ct){

                                                            for (var SH in userdata.countries[CN][CT]){

                                                                if (SH === sh) { userdata.countries[CN][CT][SH].prods.forEach(function(item){

                                                                                                //aggPs.push(item)
                                                                                })

                                                                }
                                                            }
                                                    }
                                            }
                                        }
                                        alert('location nonsense2');
                                        return
                                }

            } else if (ct==='all cities'){

                    /*if (cn === 'all countries' && sh === 'all shops'){

                            for (var CT in userdata.countries[cn]){

                                    for (var SH in userdata.countries[cn][CT]){

                                        userdata.countries[cn][CT][SH].prods.forEach(function(item, i){

                                                    aggPs.push(item)
                                        })
                                    }
                            }
                            if (cb){

                                    cb(aggPs)
                                    return
                            } 
                            } else*/ 

                    if (cn!=='all countries' /*all cities*/ && sh ==='all shops'){

                            for (var CT in userdata.countries[cn]){

                                for (var SH in userdata.countries[cn][CT]){

                                        userdata.countries[cn][CT][SH].prods.forEach(function(item, i){

                                                    aggPs.push(item);
                                                    adr.push({cn:cn, ct:CT , sh:SH});
                                                    origI.push(i);
                                        })

                                }

                            }
                            if (cb){

                                    cb(aggPs, adr, origI);
                                    return
                            }
                    } /*else if (cn==='all countries' &&  sh!=='all shops'){}*/


                    // in cn, in all its cities, get products from shop sh 
                    else if (cn!=='all countries' /* all cities */ && sh!=='all shops'){

                            for (var CT in userdata.countries[cn]){

                                for (var SH in userdata.countries[cn][CT]){

                                        if (SH === sh) {    userdata.countries[cn][CT][SH].prods.forEach(function(item,i){

                                                                    aggPs.push(item);
                                                                    adr.push({cn:cn, ct:CT,sh:SH});
                                                                    origI.push(i);
                                                            })
                                        }
                                }
                            }
                            if (cb){

                                    cb(aggPs,adr,origI);
                                    return
                            }
                    }

            } else if (sh ==='all shops'){

                    for (var SH in userdata.countries[cn][ct]){

                            userdata.countries[cn][ct][SH].prods.forEach(function(item,i){

                                    aggPs.push(item);
                                    adr.push({cn: cn, ct:ct, sh: SH});
                                    origI.push(i);
                            })

                    }
                    if (cb) { cb(aggPs, adr, origI);
                    }

            }
}

function enlargeItem(el){

        //alert(document.getElementById(el.id).getAttribute('class'));

        var c_div = document.getElementById(el.id).getAttribute('class'), 
            pic = document.getElementById(el.id).querySelector('img'), 
            pic_div, info
            //cls

            //alert(pic_div)

        if (c_div === 'displayedProductDiv'){

                    document.getElementById(el.id).setAttribute('class', 'divEnlarged')
                    
                    pic_div = document.getElementById(el.id).querySelector('div.iD_initial');
                    
                    pic_div.setAttribute('class', 'iD_large');
                    
                    info = document.getElementById(el.id).querySelector('div.productInfo')//productInfo_L
                    //alert(info);
                    
                    info.setAttribute( 'class', 'productInfo_L');

                    setTimeout(function () {
                        
                        info.style.display = 'none'
                    }, 50)

        } else if (c_div === 'divEnlarged'){
                    
                    document.getElementById(el.id).setAttribute('class', 'displayedProductDiv')

                    pic_div = document.getElementById(el.id).querySelector('div.iD_large')
                    pic_div.setAttribute('class', 'iD_initial');
                    
                    info = document.getElementById(el.id).querySelector('div.productInfo_L')
                    info.setAttribute( 'class', 'productInfo');
                    info.style.display = 'block';
                    setTimeout(function () {
                        
                        
                    }, 0)                    
        }


        
        //var pic = document.getElementById(el.id).querySelector('img')
        //alert("class: " + pic.getAttribute('class'))
        //var cls = pic.getAttribute('class')

        //if (cls === 'preview')          pic.setAttribute('class', 'picEnlarged')
        //else if (cls === 'picEnlarged') pic.setAttribute('class', 'preview')

        


        // enlarge image
        // put text under image
        // hide others
}
function editItem(div, id, arrayIndex){

        
        //alert(ev.srcElement.id + "\n" + ev.target.id + "\n" + ev.currentTarget.id)
        //return

        //alert(div.getAttribute("data-cn") + " / " + div.getAttribute("data-ct") + " / " + div.getAttribute("data-sh"))
        //return

        document.getElementById('filterProds').setAttribute("disabled", true);

        document.getElementById('addProductButton').style.display = "none";

        
        /*document.getElementById('editPanel').outerHTML =   '<div id="editPanel">' + 
                                '<div id="cancelEditItem"   style=""   >back</div>' +
                                '<div id="editItem"                  >edit</div>' + 
                                '<div id="deleteItem"                >delete</div>' + 
                            '</div>'*/


        var panel = document.getElementById('editPanel')
        panel.style.display = "flex";

        panel.whatItem = div.id;
        panel.whatArrayIndex = arrayIndex;


        //alert("to delete? " + panel.whatItem);
        //return


        div.style.backgroundColor = "rgba(255,0,0,0.3)";

        //if (window.getComputedStyle(div).backgroundColor === "rgba(255,0,0,0.3)") div.style.backgroundColor = "blue"

        /*var cn = document.getElementById("CountrySel").querySelector("option:checked").text,
            ct     = document.getElementById("CitySel").querySelector("option:checked").text,
            sh     = document.getElementById("ShopSel").querySelector("option:checked").text;*/
        var cn = div.getAttribute("data-cn"),
            ct = div.getAttribute("data-ct"),
            sh = div.getAttribute("data-sh");


        var prods = userdata.countries[cn][ct][sh].prods;


        document.getElementById('editItem').addEventListener('click', edit);
        function edit(){

                            //alert("edit")
                            
                            document.getElementById('addProductButton').style.display = "none";

                            document.getElementById('filterProds').style.display = "none"; 
                            document.getElementById('productsDiv').style.display = "none";
                            document.getElementById('cam').style.display = "none";  
                            document.getElementById('editItem').style.display = "none";
                            

                            document.getElementById('addProductDiv').style.display = "block";
                            document.getElementById('cancelAddProduct').style.display = "none"; 

                            document.getElementById('prodSubmit').style.display = "none";
                            document.getElementById('editSubmit').style.display = "flex";

                            var P = prods[arrayIndex];

                            //alert(P.prodType);

                            document.getElementById('prodType').value = P.prodType;

                            if (P.prodName) document.getElementById('prodName').value = P.prodName
                                else document.getElementById('prodName').value= ""

                            if (P.prodDesc) document.getElementById('prodDesc').value = P.prodDesc
                                else document.getElementById('prodDesc').value= ""

                            // auto-select rating
                            var rating = document.getElementById('radios').querySelectorAll('input[type = "radio"]')
                            //alert(rating);

                            for (var i=0; i<rating.length; i++){

                                        if (rating[i].value == P.rating)  rating[i].checked = true;
                                        else rating[i].checked = false
                            }

                            var img = document.getElementById('pic');
                            img.setAttribute("class", "preview");
                            img.src = cordova.file.externalDataDirectory + P.filename;


                            //document.getElementById('editItem').removeEventListener('click', edit);
                                //document.getElementById('deleteItem').removeEventListener('click', deleteIt);
                                //document.getElementById('cancelEditItem').removeEventListener('click', cancelEditItem);

                                //document.getElementById('editSubmit').removeEventListener('click', submit);

                                //get rid of duplicated event listeners? (too complicated)
                                /*document.getElementById('editPanel').outerHTML = '<div id="editPanel" style="display: flex">'+
                                                                                        '<div   id="cancelEditItem   >X</div>' + 
                                                                                        '<div   id="editItem"        >edit</div>' +
                                                                                        '<div   id="deleteItem"      >ndelete</div>' + 
                                                                                 '</div>'*/
        }

                document.getElementById('editSubmit').addEventListener('click', submit);                                                                             
                function submit(){

                        //alert("back"); 
                        //return

                        var prodType = document.getElementById('prodType').value

                        //make sure type is filled in
                        if (prodType === "") {  alert("fill in product type"); return  }

                        var njuP = { id: id,
                                    prodType: document.getElementById('prodType').value
                        }

                        if (document.getElementById('prodName').value !== "") njuP.prodName = document.getElementById('prodName').value.toString();
                        if (document.getElementById('prodDesc').value !== "") njuP.prodDesc = document.getElementById('prodDesc').value.toString();


                        //if (!document.querySelector('input[name = "rating"]:checked')) {alert ("choose rating"); return}

                        var rating = document.querySelector('input[name = "rating"]:checked').value;
                        njuP.rating = rating
                        

                        njuP.filename = id + ".jpg"


                        userdata.countries[cn][ct][sh].prods[arrayIndex] = njuP;

                        //alert(JSON.stringify(njuP));

                        setTimeout(function(){
                    
                                                    
                    
                                        saveDataFile(function(){
                    
                                                    loadStoredData();

                                                                        panel.style.display = "none";

                                                                        document.getElementById('filterProds').style.display = "block"; 
                                                                        //document.getElementById('filterProds').setAttribute("disabled", false);
                                                                        document.getElementById('filterProds').disabled = false;

                                                                        document.getElementById('addProductDiv').style.display = "none";
                                                                        document.getElementById('addProductButton').style.display = "flex";
                                                                        
                                                                        
                                                                        document.getElementById('productsDiv').style.display = "block";

                                                                        document.getElementById('editItem').style.display = "block";

                                                                        initializeForm()
                                        })
                                                    
                    
                        },200)

                        document.getElementById('editItem').removeEventListener('click', edit);
                        document.getElementById('deleteItem').removeEventListener('click', deleteIt);
                        document.getElementById('cancelEditItem').removeEventListener('click', cancelEditItem);
                        document.getElementById('editSubmit').removeEventListener('click', submit);

            }// submit func end
        

        document.getElementById('deleteItem').addEventListener('click', deleteIt)
        function deleteIt(){

                        
                        
                        /*if (document.getElementById("editSubmit").hasAttribute("click")) { 
                                alert("has click");
                                document.getElementById('editSubmit').removeEventListener('click', submit);
                        }*/

                        

                        deleteItem(div)

                        //document.getElementById('filterProds').setAttribute("disabled", false);
                        
                        document.getElementById('editItem').style.display = "block";

                        
                        document.getElementById('editItem').removeEventListener('click', edit);
                        document.getElementById('deleteItem').removeEventListener('click', deleteIt);
                        document.getElementById('cancelEditItem').removeEventListener('click', cancelEditItem);
                        document.getElementById('editSubmit').removeEventListener('click', submit);


            }


        document.getElementById('cancelEditItem').addEventListener('click', cancelEditItem)
        function cancelEditItem(){

                        /*if (document.getElementById("editSubmit").hasAttribute("onclick")) { 

                                                alert("has click");
                                                //document.getElementById('editSubmit').removeEventListener('click', submit);
                                        }*/
                        
                        //alert("cus")// document.getElementById('filterProds').removeAttribute() ) //, "false");
                        document.getElementById('filterProds').disabled = false;// removeAttribute("disabled");
                        //alert("cancel");

                        // hide whole input form
                        document.getElementById('addProductDiv').style.display = "none";

                        document.getElementById('filterProds').style.display = "block"; 
                        document.getElementById('productsDiv').style.display = "block"; 

                        document.getElementById('addProductButton').style.display = "flex";


                        document.getElementById('editItem').style.display = "block";


                        var divs = document.getElementById("productsDiv").querySelectorAll("div")
                        for (var i=0; i<divs.length;i++){
                            divs[i].style.backgroundColor = "transparent";
                        }

                        initializeForm()

                        panel = document.getElementById('editPanel');

                        panel.removeAttribute("whatItem");
                        panel.removeAttribute("whatArrayIndex");

                        panel.style.display = "none";    

                        

                        //if (cb) cb()

                        document.getElementById('editItem').removeEventListener('click', edit);
                        document.getElementById('deleteItem').removeEventListener('click', deleteIt);
                        document.getElementById('cancelEditItem').removeEventListener('click', cancelEditItem);
                        document.getElementById('editSubmit').removeEventListener('click', submit);
                        //alert("end cancel");
            }

        function deleteItem(div){

                if (confirm("delete item?" + div.id + "<<"))    {

                                        document.getElementById('editPanel').style.display = "none";
                                        

                                        var country = cn//document.getElementById("CountrySel").querySelector("option:checked").text;
                                        var city    = ct//document.getElementById('CitySel').querySelector('option:checked').text; 
                                        var shop    = sh//document.getElementById('ShopSel').querySelector('option:checked').text; 
                    
                                        var targetID = "a", filename;
                    
                                        userdata.countries[country][city][shop].prods.forEach(function(p,i){
                    
                                                    if (p.id === div.id) {
                    
                                                        targetID = i;
                                                        filename = p.filename
                                                        //alert("to delete\n\n" + p.prodType +"   id: "+ targetID +"\n\n" + filename )
                                                    }
                                                    if (i === userdata.countries[country][city][shop].prods.length-1) 
                                                            userdata.countries[country][city][shop].prods.splice(targetID, 1);
                                        })
                                        //alert(userdata.countries[country][city][shop].prods.length)// JSON.stringify();

                                        //userdata.countries[country][city][shop].prods.splice(targetID, 1);
                    


                                        setTimeout(function(){
                    
                                                    deleteImg(filename,function(){
                    
                                                                saveDataFile(function(){
                    
                                                                        loadStoredData();
                                                                
                                                                        document.getElementById('addProductButton').style.display = "flex";
                                                                })
                                                    })
                    
                                        },100)
                                        document.getElementById('filterProds').disabled = false;
                                        /*//);*/
                } else {
                    //

                        var divs = document.getElementById("productsDiv").querySelectorAll("div")
                        for (var i=0; i<divs.length;i++){
                            divs[i].style.backgroundColor = "transparent";
                        }
                        document.getElementById('filterProds').disabled = false; //document.getElementById('filterProds').setAttribute("disabled", false);
                        document.getElementById('editPanel').style.display = "none";

                        document.getElementById('addProductButton').style.display = "flex";
                        //alert ("cnaceleed");
                }

                //document.getElementById('filterProds').disabled = false;
        }
}

function deleteImg(filename,cb){

                var path = cordova.file.externalDataDirectory;
                //var filename = "myfile.txt";
                //alert("deleting: " + filename);

                window.resolveLocalFileSystemURL(path, function(dir) {
                    dir.getFile(filename, {create:false}, function(fileEntry) {
                              fileEntry.remove(function(){
                                  // The file has been removed succesfully
                                    //alert("file has been removed");
                                    if (cb) cb()

                              },function(error){
                                  // Error deleting the file
                                    alert("file cant be deleted?")
                              },function(){
                                 // The file doesn't exist
                                 alert("file doesn't exist");
                              });
                    });
                });
}

var counter = 0;
function filterProds(){


        counter ++;
        //var value = 
        
        var inp = document.getElementById('filterProds');
        

        /*if (inp.value === "") { //clearInterval(timer); 
                                //time = 0;
                                loadProducts(); return
                                setTimeout(function(){
                                        //loadProducts();
                                }, 2000)
                                //alert("value>" + "0" + "<");
                                
                                //return
                            }*/

        
        setTimeout(function(){
                    document.getElementById('productsDiv').innerHTML = "";

                    var cn = document.getElementById("CountrySel").querySelector("option:checked").text,
                        ct     = document.getElementById("CitySel").querySelector("option:checked").text,
                        sh     = document.getElementById("ShopSel").querySelector("option:checked").text;

                        
                    if (cn!=='all countries' && ct!=='all cities' && sh!=='all shops'){

                                goThruPs(userdata.countries[cn][ct][sh].prods);
                    } else {

                                aggregateProds(function(result, adr, origI){


                                                goThruPs(result,adr, origI);

                                })
                    }

                    function goThruPs(ps, adr, origI){

                                //var ps = userdata.countries[cn][ct][sh].prods;

                                //if (ps.length === 0) document.getElementById('productsDiv').innerHTML = '<p>no products to display</p>'
                                //var val = inp.value//.toString();
                                //alert(val + "  " + typeof val);
                                var hasProds = false,
                                    prevLoc  = ''

                                ps.forEach(function(p,i){
                                        
                                        var incl = false;

                                        for (var prop in p){
                                                        if ( (prop === "prodType" || prop === "prodName" || prop === "prodDesc" ) &&

                                                            p[prop].includes(document.getElementById('filterProds').value)) { 

                                                                        incl = true; 
                                                                        hasProds = true;
                                                                        break

                                                                    //alert("nju item"); 
                                                                    }
                                        }

                                        // this adds location description in in front of each prod. group
                                        if (incl) {

                                                    var currLoc = adr[i].cn + " / " + adr[i].ct + " / " + adr[i].sh;

                                                    if (prevLoc === '' || prevLoc !== currLoc){ 

                                                                    
                                                                    var node = document.createElement('div')
                                                                        if (prevLoc==='') node.innerHTML = '<div class="currLoc first">'+ currLoc +'</div>'
                                                                        else node.innerHTML = '<div class="currLoc">'+ currLoc +'</div>'
                                                                        document.getElementById('productsDiv').appendChild(node);

                                                                    prevLoc = currLoc;

                                                    }

                                                    //createProductDiv(p,i)
                                                    createProductDiv(   p, origI[i], 
                                                                        adr[i].cn, adr[i].ct, adr[i].sh
                                                                    )

                                                    //      p, originalIndexes[i] 
                                                    //      ,ads[i].cn, ads[i].ct, ads[i].sh

                                        }

                                        // if there arent any prods to match
                                        if (i===ps.length-1 && !hasProds) document.getElementById('productsDiv').innerHTML = '<p>no products to display</p>'
                                })

                    }
                    //alert("done " + ps.length);
        }, 1000)

        //});
        /*setTimeout(function(){

            //alert("couner: " + counter)
        }, 3000)*/
        
}
var time = 0;
var timer;
function startTimer(cb){

            alert("timer");
            //var time = 0;
            //alert("started");
            if (time > 0) {time = 0; clearInterval(timer)//timer = undefined;
            }
            //if (timer) timer = undefined;

            timer = setInterval(function(){


                    if (time>= 1500){ clearInterval(timer); //alert(timer); 
                                        time = 0; //timer = undefined;
                                        if (cb) cb();   ////endTimer();
                    } else time += 200;
                    
            },200)

            /*setTimeout(function(){

                alert("timer:   " + time)
            },4000)*/

            setTimeout(function(){

                alert("timer 2:   " + time)
            },7000)
}
function endTimer(el){
            //alert(time);
            clearInterval(timer);
            alert("stopped? " + time);
}


function initializeForm(){

                    //document.getElementById('prodSubmit').style.display = "block";
                    document.getElementById('editSubmit').style.display = "none";

                    document.getElementById('prodType').value = ""
                    document.getElementById('prodName').value = ""
                    document.getElementById('prodDesc').value = ""        

                    var rs = document.getElementById('radios').querySelectorAll('input[type="radio"]')

                    for (var i=0; i<rs.length; i++){

                                rs[i].checked = false;
                    }
                    

                    document.getElementById('cam').style.display = "block";  

                    document.getElementById('pic').src = "";
}
function logg(smt){
            var el = document.getElementById('contentList');

            var c2 = document.createElement("p");
            c2.style.width = '90%';
            c2.style.border = "2px solid blue";



            c2.innerHTML = smt;//.toString();
            el.appendChild(c2);
}
function log(smt){/*console.log(smt);*/ }
function seeConsole(){

        var el = document.getElementById('contentList');
        var dis = window.getComputedStyle(el).display

        //alert() //.getAttribute('visibility'))//.style.visibility)

        if (dis === "block") {el.style.display = "none"; return}
        else if (dis === "none") el.style.display = "block" //alert("none");
}






/*function openFile(event){
        console.log("openfile");

        var input = event.target;

        var reader = new FileReader();
        reader.onloadend = function(){
          var text = reader.result;
          //var node = document.getElementById('output');
          //node.innerText = text;
          var cons = document.getElementById("console");
          cons.innerText = "sukces?" + reader.result;
          //document.getElementById("fileContents").innerText(reader.result);
        };
        reader.readAsText(input.files[0]);
};*/

