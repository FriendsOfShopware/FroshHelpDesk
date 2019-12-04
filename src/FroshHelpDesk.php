<?php declare(strict_types=1);

namespace FroshHelpDesk;

use Shopware\Core\Framework\Plugin;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\Config\FileLocator;

class FroshHelpDesk extends Plugin {

    /**
     * {@inheritdoc}
     */
    public function getAdministrationEntryPath(): string
    {
        return 'Resources/views/administration';
    }
}
