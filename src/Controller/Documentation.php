<?php declare(strict_types=1);

namespace FroshHelpDesk\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use FroshHelpDesk\Service\DocumentationService;

class Documentation extends AbstractController
{
    /**
     * @var DocumentationService
     */
    private $DocumentationService;

    public function __construct(DocumentationService $DocumentationService)
    {
        $this->DocumentationService = $DocumentationService;
    }


    /**
     * @RouteScope(scopes={"api"})
     * @Route("/api/v{version}/_action/frosh/documentation/getTopCategories",
     *     name="api.action.frosh.get-top-categories",
     *     methods={"GET"}
     *     )
     */
    public function getTopCategories(Request $request): JsonResponse
    {
        $query = $request->query->all();
        $TopCategoriesResponse = $this->DocumentationService->getTopCategories($query['language']);
        return new JsonResponse([$TopCategoriesResponse]);
    }

    /**
     * @RouteScope(scopes={"api"})
     * @Route("/api/v{version}/_action/frosh/documentation/getContent",
     *     name="api.action.frosh.get-content",
     *     methods={"GET"})
     */
    public function getContent(Request $request): JsonResponse
    {
        $query = $request->query->all();

        $contentResponse = $this->DocumentationService->getContent($query['language'], $query['seoUrl']);

        if ($contentResponse['contentType'] === 'category') {
            $childCategoriesResponse = $this->DocumentationService->getChildCategories($query['language'], $contentResponse['requestedLocalization']['seoUrl']);
            $contentResponse['ChildCategories'] = array_filter($childCategoriesResponse, function ($child) use ($contentResponse) {
                return $child['parent'] === $contentResponse['id'];
            });
            $contentResponse['entries'] = array_filter($contentResponse['entries'], function ($child) {
                return $child['requestedLocalization'] !== null;
            });
            if ($contentResponse['entries']) {
                $contentResponse['contentType'] = 'childCategory';
            }
            $contentResponse['requestedLocalization']['content'] = $this->modifyUrls($contentResponse['requestedLocalization']['content']);
        } else if ($contentResponse['contentType'] === 'entry') {
            $contentResponse['requestedLocalization']['requestedVersion']['content'] = $this->modifyUrls($contentResponse['requestedLocalization']['requestedVersion']['content']);
        }

        $contentResponse['language'] = $query['language'];


        return new JsonResponse([$contentResponse]);
    }


    /**
     * @RouteScope(scopes={"api"})
     * @Route("/api/v{version}/_action/frosh/documentation/getChildCategories",
     *     name="api.action.frosh.get-child-categories",
     *     methods={"GET"})
     */
    public function getChildCategories($language, $seoUrl): JsonResponse
    {
        $ChildCategoriesResponse = $this->DocumentationService->getChildCategories($language, $seoUrl);

        return new JsonResponse([$ChildCategoriesResponse]);
    }


    public function modifyUrls($content): string
    {
        $content = $this->replaceLinkTarget($content);
        $content = $this->replaceLinkHref($content);


        return $content;
    }

    public function replaceLinkTarget($content): string
    {
        preg_match_all('/"\/[en|de]\/?.*".*target="(.+?)"/',$content,$matches);

        foreach ($matches[0] as $match) {
            $replacement = str_replace('_blank','_self', $match);
            $content = str_replace($match, $replacement, $content);
        }
        return $content;
    }

    public function replaceLinkHref($content): string
    {
        preg_match_all('/"[\/de|\/en].+?"/',$content,$linkMatch);

        foreach ($linkMatch[0] as $match) {
            $language = substr($match,2,2);
            preg_match('/"(\/en|\/de)(.+?)["|#|?]/', $match, $seoUrl);
            if (isset($seoUrl[2])) {
                $replacement = "admin#/sw/documentation/view?seoUrl=".$seoUrl[2]."&language=".$language;
            } else {
                $replacement = "admin#/sw/documentation/view?language=".$language;
            }

            $content = str_replace($match, $replacement, $content);
        }

        return $content;
    }

}
