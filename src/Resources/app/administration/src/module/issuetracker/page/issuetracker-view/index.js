import { Component, Mixin } from 'src/core/shopware';
import template from './issuetracker-view.html.twig';
import './issuetracker-view.scss';

Component.register('issuetracker-view', {
    template,
    mixins: [
        Mixin.getByName('listing'),
        Mixin.getByName('notification')
    ],
    inject: ['issuetrackerService'],
    data() {
        return {
            disableRouteParams: true,
            isLoading: false,
            issues: [{
            }],
            limit: 25,
            offset: 0,
            page: 1,
            total: 500,
            ticketDetails: false,
            ticketComments: false,
            ticketAddComment: false,
            createTicket: false,
            issue: [{}],
            ticketCreation: {
                ticketType: '',
                name: '',
                email: '',
                title: '',
                message: ''
            },
            commentCreation: {
                ticket: '',
                message: '',
                name: '',
                email: ''
            },
            ticketKey: ''
        };
    },
    watch: {
    },
    computed: {
        columns() {
            return [
                { property: 'type.name', label: this.$tc('issuetracker.grid-columns.type'), rawData: true },
                { property: 'key', label: '#', rawData: true },
                { property: 'title', label: this.$tc('issuetracker.grid-columns.title'), rawData: true },
                { property: 'status.name', label: this.$tc('issuetracker.grid-columns.status'), rawData: true },
                { property: 'fixVersions.0.name', label: this.$tc('issuetracker.grid-columns.fixVersion'), rawData: true },
                { property: 'comments.length', label: this.$tc('issuetracker.grid-columns.comments'), rawData: true },
                { property: 'votes', label: this.$tc('issuetracker.grid-columns.votes'), rawData: true }
            ];
        },
        ticketType() {
            return [
                { value: '7', name: this.$tc('issuetracker.modal.story') },
                { value: '1', name: this.$tc('issuetracker.modal.bug') },
                { value: '10201', name: this.$tc('issuetracker.modal.idea') }
            ];
        }
    },
    methods: {
        getList() {
            this.getIssues();
        },
        getIssues() {
            this.isLoading = true;
            this.issuetrackerService.getIssues(this.limit, this.offset).then(({ data, total }) => {
                this.issues = data;
                this.total = parseInt(total, 10);
            }).finally(() => {
                this.isLoading = false;
            });
        },
        onPageChange(data) {
            this.page = data.page;
            this.limit = data.limit;
            this.offset = data.limit * (data.page - 1);
            this.getList();
        },
        openIssue(issue) {
            this.ticketDetails = true;
            this.ticketComments = false;
            this.ticketAddComment = false;
            this.createTicket = false;
            this.issue = issue;
        },
        openComments(issue) {
            this.ticketDetails = false;
            this.ticketComments = true;
            this.ticketAddComment = false;
            this.createTicket = false;
            this.issue = issue;
        },
        addComment(issue) {
            this.ticketDetails = false;
            this.ticketComments = false;
            this.ticketAddComment = true;
            this.createTicket = false;
            this.issue = issue;
        },
        addTicket() {
            this.ticketDetails = false;
            this.ticketComments = false;
            this.ticketAddComment = false;
            this.createTicket = true;
        },
        closeIssue() {
            this.ticketDetails = false;
        },
        closeCreateTicket() {
            this.createTicket = false;
            this.ticketCreation = {};
        },
        closeComments() {
            this.ticketComments = false;
        },
        closeAddComment() {
            this.ticketAddComment = false;
            this.commentCreation = {};
        },
        sliceTicket(ticketKey) {
            this.getList();
            const issues = this.issues;
            console.log(issues);
            const issue = issues.find((element) => {
                return element.key === ticketKey.toString();
            });
            return issue;
        },
        createIssue() {
            this.issuetrackerService.createIssue(this.ticketCreation).then((response) => {
                this.closeCreateTicket();
                this.issue = response[0][0];
                this.openIssue(this.issue);
                this.getList();
                return response;
            }).catch((error) => {
                this.createNotificationError({
                    title: this.$t('issuetracker.error.title'),
                    message: error
                });
            });
        },
        createComment() {
            this.ticketKey = this.issue.key;
            this.commentCreation.ticket = this.issue.key;
            this.issuetrackerService.createComment(this.commentCreation).then((response) => {
                this.issue = this.sliceTicket(this.ticketKey);
                this.closeAddComment();
                this.openComments(this.issue);
                return response;
            }).catch((error) => {
                this.createNotificationError({
                    title: this.$t('issuetracker.error.title'),
                    message: error
                });
            });
        }
    }
});
