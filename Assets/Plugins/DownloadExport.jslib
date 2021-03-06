mergeInto(LibraryManager.library, {
    ExportGltf: function(path) {                   
        var filePath = Pointer_stringify(path);
        console.log(filePath);
        
        var openReq = indexedDB.open("/idbfs").onsuccess = function(event) {
            var db = event.target.result;
            var objectStore = db.transaction("FILE_DATA").objectStore("FILE_DATA").openCursor(filePath).onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    console.log(cursor);
                    var filename = filePath.split("/").pop();
                
                    var glbFile = cursor.value.contents.buffer;

                    // Get window.URL object
                    var URL = window.URL || window.webkitURL;

                    // Create an invisible <a> element
                    var a = document.createElement("a");
                    a.style.display = "none";
                    document.body.appendChild(a);

                    // Set the HREF to a Blob representation of the data to be downloaded
                    a.href = URL.createObjectURL(new Blob([glbFile], {type: "model/gltf-binary"}));

                    // Use download attribute to set set desired file name
                    a.setAttribute("download", filename);

                    // Trigger the download by simulating click
                    a.click();

                    // Cleanup
                    window.URL.revokeObjectURL(a.href);
                    document.body.removeChild(a);
                }
                else {
                    console.log("Not found");
                    console.log(event);
                }
            };
        };
    }
});