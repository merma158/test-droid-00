(function() {
    var apiKey = "SCB2d1hANjfQuknl";
    var el = new Everlive(apiKey);
	
    /*
    var groceryDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/" + apiKey + "/Groceries",
                dataType: "jsonp"
            }
        },
        schema: {
            data: function(response) {
                return response.Result;
            }
        }
    });
    */
    
    var groceryDataSource = new kendo.data.DataSource({
      type: "everlive",
      sort: { field: "Name", dir: "asc" },
      transport: {
          typeName: "Groceries"
      }
    });

    function initialize() {
        window.addView = kendo.observable({
          add: function() {
              if (!this.grocery) {
                  navigator.notification.alert("Please provide a grocery.");
                  return;
              }

              groceryDataSource.add({ Name: this.grocery });
              groceryDataSource.one("sync", this.close);
              groceryDataSource.sync();
          },
          close: function() {
              $("#add").data("kendoMobileModalView").close();
              this.grocery = "";
          }
        });
        
        var app = new kendo.mobile.Application(document.body, {
            skin: "flat",
            transition: "slide"
        });
        
        navigator.splashscreen.hide();
        
        $("#grocery-list").kendoMobileListView({
          dataSource: groceryDataSource,
          template: "#: Name #"
        });
        
        
    }

    document.addEventListener("deviceready", initialize);
}());