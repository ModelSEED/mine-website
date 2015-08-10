// This controls the selection of KEGG metabolic reconstructions. Currently only used for metabolomics search
angular.module('app').controller('modelsCtl', function($scope, $state, sharedFactory){

    // By default, selectize filters results by matching a field to a query, that's not a feature we want for model
    // searching because it ruins the server side logic. The following code overwrites the search function to return all items
    Selectize.prototype.search = function (query) {
      return {
        query: query,
        tokens: [], // disable highlight
        items: $.map(this.options, function (item, key) {
          return {id: key}
        })
      }
    };

    $( '#model-select').selectize({
        valueField: 'name',
        labelField: 'name',
        options: sharedFactory.model_list,
        items:[sharedFactory.selected_model],
        /*render: {
            options: function (data, escape) {
                return '<div>' +
                    '<span class="name">' + escape(data.name) + '</span>' +
                    '<span class="db">' + escape(data.id) + '</span>' +
                    '</div>';
            }
        },*/
        // triggered when a user enters a query, performs a model search and returns the results as options
        load: function (query, callback) {
            this.options = {}; // blank out prior options
            var promise = sharedFactory.services.model_search(query);
            promise.then(
                function (result) {
                    // select expects a list of objects not strings, for now we convert here but this should be changed on the server side
                    data = $.map(result, function (n, i) {
                        return ({name: n, id: i});
                    });
                    console.log(result);
                    sharedFactory.model_list = data;
                    callback(data);
                },
                function (err) {
                    console.log("Model Search Failure");
                    callback()
                }
            );
        },
        // triggered when a user selects a metabolic model
        onChange: function(value) {
            sharedFactory.selected_model = value;
            // this if the model selection could affect results, reload the page to reflect the changes
            if (sharedFactory.db_dependent_states.indexOf($state.current.name) > -1) $state.go($state.current,{},{reload:true});
        }
    });
});