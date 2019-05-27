<?php declare(strict_types = 1);

namespace FroshHelpDesk\Service;

use GuzzleHttp\Client;

class DocumentationService
{
    /**
     * @var Client
     */
    private $client;

    public function __construct(
        Client $client
    ) {
        $this->client = $client;
    }

    public function getTopCategories($language): array
    {
        $response = $this->client->get(
            '/wiki/router/locales/'.$language.'/categories', []
        );
        return json_decode($response->getBody()->getContents(), true);
    }

    public function getChildCategories($language, $route): array
    {
        $response = $this->client->get(
            '/wiki/router/locales/'.$language.'/categories'.$route, []
        );
        return json_decode($response->getBody()->getContents(), true);
    }

    public function getContent($language, $route): array
    {
        $response = $this->client->get(
            '/wiki/router/'.$language.$route, []
        );
        return json_decode($response->getBody()->getContents(), true);
    }
}
