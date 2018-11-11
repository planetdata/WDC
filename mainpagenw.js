
  (function() {
  
  
  
    var wtUser = 'admin';
    var wtPass = 'We8care@';
	
	//Setting up the Basic Authorization Header
$.ajaxSetup({
     headers: {'Authorization': "Basic " + btoa("my_username" + ":" + "my_password")}
})


// Set CORS Proxy name
    var corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Set connection name to be used in Tableau
    var connectionName = 'Splunk data';
	
 



function buildURL() {
	
      var url = corsProxy + 'https://10.0.0.4:8089/services/search/jobs/oneshot?search=search%20index%3Damita-index';
      return url;
	  
	  console.log(url);
    }

	
	
	   // Create the connector object
	 console.log("Creating Tableau connection...");
    var myConnector = tableau.makeConnector();

	
	myConnector.init = function(initCallback) {
      tableau.authType = tableau.authTypeEnum.basic;
      initCallback();


    // Define the schema
   myConnector.getSchema = function(schemaCallback) {

       var cols = [{
                id: "_sourcetype",
                alias: "_sourcetype",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "host",
                alias: "host",
                dataType: tableau.dataTypeEnum.string
            }
			
        ];

        var tableSchema = {
            id: "query",
            alias: "basic querying",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

	
	
      // Create basicAuth token
      var basicAuth = buildBaseAuth(auth.username, auth.password);
      console.log("Basic auth token created.");
  
      // Create connection URL
      var connectionURL = buildURL();
      console.log("Connection URL created.");

// Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON(connectionURL, function(resp) {
            var feat = resp.content,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "_sourcetype": feat[i]._sourcetype,
                    "host": feat[i].host 
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);
    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Storage"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
  
