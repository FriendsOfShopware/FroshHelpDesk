<?php declare(strict_types = 1);

namespace FroshHelpDesk\Service;

use GuzzleHttp\Client;

class IssuetrackerService
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

    public function getIssues($limit, $offset): array
    {
        $response = $this->client->get(
            '/issues?limit='.$limit.'&offset='.$offset.'&projects[]=NEXT', []
        );
        return [json_decode($response->getBody()->getContents(), true),$response->getHeader('SW-Meta-Total')];
    }

    public function createIssue($postData): array
    {
        $json = [
            'type' => [
                'id' => $postData['ticketType'],
            ],
            'isPrivate' => false,
            'affectsVersions' => [
            ],
            'title' => $postData['title'],
            'reporter' => $postData['name'],
            'reporterEmail' => $postData['email'],
            'priority' => 4,
            'message' => $postData['message'],
            'attachmentUrls' => [
            ],
            'projectKey' => 'NEXT',
            'affectedPlugin' => '',
        ];

        $response = $this->client->post(
            '/issues', [
                'json' => $json,
            ]
        );
        return [json_decode($response->getBody()->getContents(), true)];
    }

    public function createComment($postData): array
    {
        $json = [
            'author' => $postData['name'],
            'authorEmail' => $postData['email'],
            'message' => $postData['message']
        ];

        $response = $this->client->post(
            '/issues/'.$postData['ticket'].'/comments', [
                'json' => $json,
            ]
        );
        return [json_decode($response->getBody()->getContents(), true)];
    }
}
