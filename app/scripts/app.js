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
        /*
        el.Users.login("demo", "demo.1",
          function(data) {
              groceryDataSource.read();
          }
        );
        */
        window.loginView = kendo.observable({
          submit: function() {
              if (!this.username) {
                  navigator.notification.alert("Username is required.");
                  return;
              }
              if (!this.password) {
                  navigator.notification.alert("Password is required.");
                  return;
              }
              el.Users.login(this.username, this.password,
                  function(data) {
                      window.location.href = "#list";
                      groceryDataSource.read();
                  }, function() {
                      navigator.notification.alert("Unfortunately we could not find your account.");
                  });
          }
        });
        
        window.listView = kendo.observable({
          logout: function(event) {
              // Prevent going to the login page until the login call processes.
              event.preventDefault();
              el.Users.logout(function() {
                  this.loginView.set("username", "" );
                  this.loginView.set("password", "");
                  window.location.href = "#login";
              }, function() {
                  navigator.notification.alert("Unfortunately an error occurred logging out of your account.");
              });
          }
        });
        
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