var generalTour = function(){
    var host = window.location.href.split('#')[0];
    return {
        storage:false,
        steps: [
            {
                orphan: true,
                title: "Exploring the MINE Databases",
                content: "Welcome the home of the MINE databases. This tour will give you an overview of the features of this " +
                    "website and help you find the data you are looking for."
            },
            {
                element: "#qs_text",
                placement: "left",
                title: "Find compounds with Quick Search",
                content: "You can search the database with chemical identifiers like InChIKeys or KEGG Codes here. You can also " +
                    "enter text to search aliases, EC Classes and Pathway data.",
                onNext: function(){
                    window.location.assign(host+ '#/compoundsascorbate,undefined')
                }
            },
            {
                element: "#db-select",
                placement: "bottom",
                title: "Change the source database",
                content: "You can switch between the MINE source databases here any time."
            },
            {
                onShow: function(){window.location.assign(host+ '#/compoundsascorbate,undefined')},
                element: "#comp-row",
                placement: "left",
                reflex: true,
                title: "Go to the compound page",
                content: "Once you have found an interesting compound, click on the row to see more details"
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompoundC87aef7cd8fe907e7d7ef27f8e917e39cba5e0cee/overview')},
                orphan: true,
                title: "Compound Data page",
                content: "This page displays any data available for a MINE compound."
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompoundC87aef7cd8fe907e7d7ef27f8e917e39cba5e0cee/overview')},
                element: "#compound-image",
                title: "Get a closer look at the compound",
                content: "Click the compound image to get a closer look at the chemical structure. When you are done " +
                    "click the background."
            },
            {
                element: "#db-links",
                placement: "left",
                title: "Find more information about a compound",
                content: "Click the header of any of these sections to see their contents. You can find the compound in other " +
                    "databases in various chiral and charged forms"
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompoundC87aef7cd8fe907e7d7ef27f8e917e39cba5e0cee/reactants')},
                element: "#reactions",
                title: "Explore reactions that involve this compound",
                content: "See all the predicted reactions that produce or consume this compound."
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompoundC87aef7cd8fe907e7d7ef27f8e917e39cba5e0cee/reactants')},
                element: "#rxn-filter",
                title: "Filter by reaction type",
                content: "Enter a partial EC number to show only reactions predicted by an operator"
            },
            {
                onShow: function(){window.location.assign(host+ '#/acompoundC87aef7cd8fe907e7d7ef27f8e917e39cba5e0cee/reactants')},
                element: "#rxn-img",
                placement: "left",
                title: "Examine computationally predicted derivatives",
                content: "Mouse over a structure to display it's name and MINE id. Click to go to that compound's info page"
            },
            {
                orphan: true,
                title: "Learning more",
                content: "If you have additional questions, please check out our Frequently Asked Questions. You might also me " +
                    "interested in taking our Metabolomics tour here. We hope you find this resource valuable!"
            }
        ]
    }
};