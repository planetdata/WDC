(function() {
    // Create the connector object
	 console.log("Creating Tableau connection...");
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {

        var query_cols = [{
                id: "_sourcetype",
                alias: "_sourcetype",
                dataType: tableau.dataTypeEnum.string
            }, {
                id: "host",
                alias: "host",
                dataType: tableau.dataTypeEnum.string
            },
			{
                id: "_raw",
                alias: "_raw",
                dataType: tableau.dataTypeEnum.string
            },
            
        ];

        var queryTableSchema = {
            id: "query",
            alias: "basic querying",
            columns: query_cols
        };

        schemaCallback([queryTableSchema]);
    };

	
	function buildBaseAuth(username, password) {
    
      var tok = tableau.username + ':' + tableau.password;
      var hash = btoa(tok);
  
      basicAuth = "Basic " + hash;
      
      return basicAuth;
	}
	
	  // Set connection name to be used in Tableau
    var connectionName = 'test Splunk data';
	
    
      //  var auth = {};
      //  auth.username = tableau.username;
       // auth.password = tableau.password;
       // auth.rememberMe = 'true'
       // auth = JSON.stringify(auth);
        



function buildURL() {
      // REST URL build Helper function
      // The resulting URL should look like this, but with proxy:
      // https://ws.webtrends.com/v3/Reporting/profiles/XXXXX/reports/YYYYYYYYYYY/?start_period=2016m01d01&end_period=2016m01d08&&period_type=indv&totals=none&format=json&language=en-EN&suppress_error_codes=true
	  
	 var proxy = 'https://github.com/planetdata/WDC/blob/master/splunkproxy.php?u=';
      var url = proxy + 'https://10.0.0.4:8089/services/search/jobs/oneshot?search=search%20index%3Damita-index';
      return url;
    }




myConnector.getColumnHeaders = function () {
      var fieldNames = ['_sourcetype', 'host'];
      var fieldTypes = ['string', 'string']; 
      tableau.headersCallback(fieldNames, fieldTypes);
    };

    myConnector.getTableData = function () {

      // Create basicAuth token
      var basicAuth = buildBaseAuth(auth.username, auth.password);
      console.log("Basic auth token created.");
  
      // Create connection URL
      var connectionURL = buildURL();
      console.log("Connection URL created.");

      // Get the data
      console.log("Fetching data...");
      var xhr = $.ajax({
        type: 'GET',
        url: connectionURL,
        dataType: 'json',
        headers: {'Authorization': basicAuth},
        success: function (response, status, xhr) {
          if (response.data) {
            var result = [];

            for (host in response.data) {
              
                    var entry = {   'host':              host
                                  , 'Dimension2':        _sourcetype
                                
                                };
                    result.push(entry);
                  }
             
			
		
			
			
			
            console.log("Data complete. Sending to Tableau...");
            tableau.connectionName = connectionName;
            tableau.connectionData = connectionURL;
            setTimeout(function(){tableau.dataCallback(result, "", false)}, 3000);

          } else {
            console.log("No results found.");
            tableau.abortWithError("No results found.");
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          console.log("Error while trying to connect to the Splunk data source.");
          tableau.log("Connection error: " + xhr.responseText + "\n" + thrownError);
          tableau.abortWithError("Error while trying to connect to the Splunk data source.");
        }
      });
    };
  
    tableau.registerConnector(myConnector);

    $(document).ready(function () {
      setTimeout(function(){tableau.submit()}, 3000);
    });
  
 
  


    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            var connectionData = {};
            tableau.password = document.getElementById('password').value;
            tableau.username = document.getElementById('username').value
            tableau.connectionName = connectionName
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
    // Init function for connector, called during every phase
    myConnector.init = function(initCallback) {

        tableau.authType = tableau.authTypeEnum.custom;
        
        initCallback();
    }
})();