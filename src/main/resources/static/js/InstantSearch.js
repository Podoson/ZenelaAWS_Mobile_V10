/**
 * @typedef {Object} InstantSearchOptions
 * @property {URL} searchUrl The URL which the search bar will query to retrieve results
 * @property {string} queryParam
 * @property {Function} responseParser
 * @property {Function} templateFunction
*/





class InstantSearch{

    /**
     * Initialises the instant search bar. Retrieves and create elements.
     * @param {HTMLElement} instantSearch The container element for the instant search
     * @param {InstantSearchOptions} options A list of options for configuration
     */
    constructor(instantSearch, options) {
        this.options = options;
        this.elements = {
            main: instantSearch,
            input: instantSearch.querySelector(".is_input"),
            resultsContainer: document.createElement("div")
        };

        this.elements.resultsContainer.classList.add("is_results-container");
        this.elements.main.appendChild(this.elements.resultsContainer);

        this.addListeners();
    }

    addListeners() {
        let delay;

        this.elements.input.addEventListener("input", () => {

            clearTimeout(delay);

            const query = this.elements.input.value;

            delay = setTimeout(() => {

                // if(query.length < 3){
                //     this.populateResults([]);
                //     return;
                // }
                this.performSearch(query).then(results => {
                    this.populateResults(results);
                });
            }, 500);
        });

        this.elements.input.addEventListener("focus", () => {
            this.elements.resultsContainer.classList.add("is_results-container-visible");
        });

        this.elements.input.addEventListener("blur", () => {
            this.elements.resultsContainer.classList.remove("is_results-container-visible");
        });
    }

    /**
     * Updates the HTML to display each result under the search bar
     * @param {Object[]} results
     */
    populateResults(results) {

        // clear all existing results
        while (this.elements.resultsContainer.firstChild){
            this.elements.resultsContainer.removeChild(this.elements.resultsContainer.firstChild);
        }

        // Update list of results under the search bar
        for(const result of results){
            this.elements.resultsContainer.appendChild(this.createResultElement(result));
        }
    }

    /**
     * Create the HTML to represent a single result in the list of results.
     *
     * @param {Object} result An instant search result
     */
    createResultElement(result){
        const anchorElement = document.createElement("a");

        anchorElement.classList.add("is_result");
        anchorElement.insertAdjacentHTML("afterbegin", this.options.templateFunction(result));

        // If provided, add a link for the result

        anchorElement.setAttribute("href", result.href);

        return anchorElement;
    }

    /**
     * Makes a request at the search URL and retrieves results;
     * @param {string} query Search query
     * @returns {Promise<Object[]>}
     */
    performSearch(query){
        const url = new URL(this.options.searchUrl.toString());

        url.searchParams.set(this.options.queryParam, query);

        return fetch(url, {
            method: "get"
        }).then(response => {
            if(response.status !== 200){
                throw new Error("Something went wrong with the search");
            }

            return response.json();
        }).then(responseData => {
            console.log(responseData);

            return this.options.responseParser(responseData);
        }).catch(error => {
            console.error(error);

            return[];
        });
    }
}

export default InstantSearch;












