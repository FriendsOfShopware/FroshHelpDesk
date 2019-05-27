<?php declare(strict_types=1);

namespace FroshHelpDesk\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use FroshHelpDesk\Service\IssuetrackerService;

class Issuetracker extends AbstractController
{
    /**
     * @var IssuetrackerService
     */
    private $IssuetrackerService;

    public function __construct(IssuetrackerService $IssuetrackerService)
    {
        $this->IssuetrackerService = $IssuetrackerService;
    }


    /**
     * @Route("/api/v{version}/_action/frosh/issuetracker/getIssues",
     *     name="api.action.frosh.get-issues",
     *     methods={"GET"}
     *     )
     */
    public function getIssues(Request $request): JsonResponse
    {
        $query = $request->query->all();
        $IssuesResponse = $this->IssuetrackerService->getIssues($query['limit'], $query['offset']);
        return new JsonResponse([$IssuesResponse]);
    }

    /**
     * @Route("/api/v{version}/_action/frosh/issuetracker/createIssue",
     *     name="api.action.frosh.create-issue",
     *     methods={"POST"}
     *     )
     */
    public function createIssue(Request $request): JsonResponse
    {
        $postData = $request->getContent();
        $CreateResponse = $this->IssuetrackerService->createIssue(json_decode($postData, true));
        return new JsonResponse([$CreateResponse]);
    }

    /**
     * @Route("/api/v{version}/_action/frosh/issuetracker/createComment",
     *     name="api.action.frosh.create-comment",
     *     methods={"POST"}
     *     )
     */
    public function createComment(Request $request): JsonResponse
    {
        $postData = $request->getContent();
        $CreateResponse = $this->IssuetrackerService->createComment(json_decode($postData, true));
        return new JsonResponse([$CreateResponse]);
    }
}
