import { Component, Mixin } from 'src/core/shopware';
import template from './documentation-view.html.twig';
import './documentation-view.scss';

Component.register('documentation-view', {
    template,
    mixins: [
        Mixin.getByName('listing')
    ],
    inject: ['documentationService'],
    data() {
        return {
            disableRouteParams: true,
            isLoading: false,
            content: {
                contentType: 'topCategory',
                requestedLocalization: {
                    title: '',
                    content: ''
                }
            },
            categoryChilds: [],
            entries: [],
            language: 'en',
            languageURL: ''
        };
    },
    watch: {
        '$route'() {
            this.getList();
        },
        '$root.$i18n.locale'() {
            this.changeLanguage();
        }
    },
    methods: {
        changeLanguage() {
            const language = this.documentationService.changeLanguage(this.language, this.languageURL);
            this.$route.query.language = language.queryLanguage;
            this.$route.query.seoUrl = language.querySeoUrl;
            this.getList();
        },
        getList() {
            this.isLoading = true;
            if (this.$route.query.language) {
                this.language = this.$route.query.language;
            } else {
                this.$route.query.language = this.language;
            }
            if (this.$route.query.seoUrl) {
                this.getContent();
            } else {
                this.getTopCategories();
            }
            this.isLoading = false;
        },
        getTopCategories() {
            Object.assign(this.$data, this.$options.data.apply(this));
            this.documentationService.getTopCategories(this.$route.query.language).then((categoryContent) => {
                this.categoryChilds = categoryContent[0];
                this.language = this.$route.query.language;
            }).catch((error) => {
                this.createNotificationError({
                    title: this.$t('documentation.error.title'),
                    message: error
                });
            });
        },
        getContent() {
            Object.assign(this.$data, this.$options.data.apply(this));
            this.documentationService.getContent(
                this.$route.query.language,
                this.$route.query.seoUrl
            ).then((categoryContent) => {
                this.content = categoryContent[0];
                this.categoryChilds = categoryContent[0].ChildCategories;
                this.entries = categoryContent[0].entries;
                this.languageURL = categoryContent[0].otherLocalizations;
                this.language = this.$route.query.language;
            }).catch((error) => {
                this.createNotificationError({
                    title: this.$t('documentation.error.title'),
                    message: error
                });
            });
        }
    }
});
