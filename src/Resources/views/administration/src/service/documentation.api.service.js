import ApiService from 'src/core/service/api.service';
/**
 * Gateway for the API end point "Documentation"
 * @class
 * @extends ApiService
 */
class DocumentationApiService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = 'documentation') {
        super(httpClient, loginService, apiEndpoint);
        this.name = 'documentationService';
    }

    getTopCategories(language) {
        const headers = this.getBasicHeaders();

        return this.httpClient
            .get(`/_action/frosh/documentation/getTopCategories?language=${language}`, { headers })
            .then((response) => {
                return ApiService.handleResponse(response);
            });
    }

    getContent(language, seoUrl) {
        const headers = this.getBasicHeaders();

        return this.httpClient
            .get(`/_action/frosh/documentation/getContent?language=${language}&seoUrl=${seoUrl}`, { headers })
            .then((response) => {
                return ApiService.handleResponse(response);
            });
    }

    changeLanguage(language, languageURL) {
        if (language === 'en') {
            this.queryLanguage = 'de';
        } else {
            this.queryLanguage = 'en';
        }
        if (languageURL) {
            if (language === 'en') {
                this.querySeoUrl = languageURL[0].seoUrl;
            } else {
                this.querySeoUrl = languageURL[1].seoUrl;
            }
        }
        return {
            querySeoUrl: this.querySeoUrl,
            queryLanguage: this.queryLanguage
        };
    }
}

export default DocumentationApiService;
