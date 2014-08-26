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
                content: "You can search the database with chemical identifiers like InChIKeys or KEGG Codes here or" +
                    " with textual data such as aliases, EC Classes or KEGG pathway maps."
            },
            {
                onShow: function(){window.location.assign(host+ '#/structure')},
                element: "#struct-tab",
                placement: "bottom",
                title: "Use structure search",
                content: "There are a number of structural search features available here"
            },
            {
                element: "#canvas",
                title: "Chemical Canvas",
                content: "You can draw a chemical structure with Marvin4JS"
            },
            {
                element: "#search-options",
                placement: "left",
                title: "Search Options",
                content: "You can search for compounds with similar functional groups, with common substructure or " +
                    "exact matches to your compound"
            },
            {
                onShow: function(){window.location.assign(host+ '#/structure')},
                element: "#sim-thresh",
                placement: "left",
                title: "Similarity Threshold",
                content: "This allows you to set a minimum Tanimoto similarity (using FP4 fingerprints)",
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
                onShow: function(){window.location.assign(host+ '#/acompoundC87aef7cd8fe907e7d7ef27f8e917e39cba5e0cee/reactants')},
                element: "#struct-tab",
                placement: "bottom",
                title: "Use structure search",
                content: "There are a number of structural search features available here"
            },
            {
                onShow: function(){window.location.assign(host+ '#/structure')},
                element: "#struct-tab",
                placement: "bottom",
                title: "Use structure search",
                content: "There are a number of structural search features available here"
            },
            {
                orphan: true,
                title: "Learning more",
                content: "If you have additional questions, please check out our Frequently Asked Questions. You might also be " +
                    "interested in taking our Metabolomics tour. We hope you find this resource valuable!"
            }
        ]
    }
};
var metabolomicsTour = function(){
    var host = window.location.href.split('#')[0];
    return {
        storage:false,
        steps: [
            {
                orphan: true,
                title: "Annotating MS/MS data with MINEs",
                content: "Welcome the home of the MINE databases. This tour will give you an overview of using the MINE" +
                    "databases to annotate high resolution metabolomics data."
            },
            {
                element: "#met-tab",
                placement: "bottom",
                title: "The Metabolomics tab",
                content: "This link will take you to the metabolomics annotation form.",
                reflex: true,
                onNext: function(){
                    window.location.assign(host+ '#/metabolomics')
                }
            },
            {
                element: "#db-select",
                placement: "bottom",
                title: "Change the source database",
                content: "You can switch between the MINE source databases here any time."
            },
            {
                element: "#models_text",
                placement: "right",
                title: "Selecting a metabolic model",
                content: "Type in an organism name to search for a metabolic model. Click a model in the box below to" +
                    "set the model as the standard for native metabolites."
            },
            {
                element: "#trace",
                title: "Enter M/Z values",
                content: "Type or paste mass/charge ratios, one per line."
            },
            {
                element: "#tolerance",
                placement: "left",
                title: "Set the mass tolerance",
                content: "You can adjust the mass range for all your results and units of entry."
            },
            {
                element: "#halogen",
                placement: "left",
                title: "Toggle the presence of halogenated compounds",
                content: "KEGG has a number of non-natural halogenated compounds. If checked, these will be included in" +
                    " searches"
            },
            {
                element: "#charge",
                placement: "left",
                title: "Select ion mode",
                content: "Select an ion charge to change the list of available adduct types"
            },
            {
                element: "#adducts",
                placement: "left",
                title: "Select adducts to search on",
                content: "You can select potential adduct types here. use CTRL+click to select individual adducts or " +
                    "SHIFT+click to select a range of compounds",
                onNext: function(){
                    window.location.assign(host+ '#/AlternateMetabolomicsCompounds')
                }
            },
            {
                orphan: true,
                title: "Tabular Metabolomics Results",
                content: "This page displays information for all compounds which match your search criteria. Compounds " +
                    "in the source database are shown in green while those in a selected metabolic model are shown in red."
            },
            {
                element: "#filters",
                title: "Filtering results",
                content: "You can enter text here to filter the results shown."
            },
            {
                element: "#met-img",
                title: "Getting more information",
                content: "Click the compound image to see the compound's full entry."
            },
            {
                orphan: true,
                title: "Learning more",
                content: "If you have additional questions, please check out our Frequently Asked Questions. You might also be " +
                    "interested in taking our Metabolomics tour. We hope you find this resource valuable!"
            }
        ]
    }
};