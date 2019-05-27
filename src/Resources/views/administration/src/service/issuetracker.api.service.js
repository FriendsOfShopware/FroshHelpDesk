import ApiService from 'src/core/service/api.service';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

/**
 * Gateway for the API end point "Issuetracker"
 * @class
 * @extends ApiService
 */
class IssuetrackerApiService extends ApiService {
    constructor(httpClient, loginService, apiEndpoint = 'issuetracker') {
        super(httpClient, loginService, apiEndpoint);
        this.name = 'issuetrackerService';
    }

    getIssues(limit, offset) {
        const headers = this.getBasicHeaders();

        return this.httpClient
            .get(`/_action/frosh/issuetracker/getIssues?limit=${limit}&offset=${offset}`, { headers })
            .then((response) => {
                const result = ApiService.handleResponse(response);

                return {
                    data: result[0][0],
                    total: result[0][1]
                };
            })
            .then((result) => {
                const data = result.data;

                result.data = data.map((item) => {
                    item.message = md.render(item.message);
                    if (item.comments.length > 0) {
                        item.comments = item.comments.map((comment) => {
                            comment.message = md.render(comment.message);
                            return comment;
                        });
                    }
                    return item;
                });

                return result;
            });
    }

    createIssue($postData) {
        const headers = this.getBasicHeaders();
        return this.httpClient
            .post('/_action/frosh/issuetracker/createIssue', $postData, { headers })
            .then((response) => {
                return response.data;
            });
    }

    createComment($postData) {
        const headers = this.getBasicHeaders();
        return this.httpClient
            .post('/_action/frosh/issuetracker/createComment', $postData, { headers })
            .then((response) => {
                return response.data;
            });
    }
}

export default IssuetrackerApiService;
